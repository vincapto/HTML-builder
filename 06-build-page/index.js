const fs = require('fs');
const path = require('path');

const copyPath = path.join(__dirname, 'project-dist');
const copyPathAssets = path.join(copyPath, 'assets');
const bundle = 'style.css';
const enterPoint = 'index.html';

async function start() {
  await fs.promises.rm(copyPath, { recursive: true, force: true }, (err) => {
    if (err) console.log('folder not exist');
    console.log('clear project dir');
  });
  await checkFolderExist(copyPathAssets);
  await readFolder(path.join(__dirname, 'assets'), copyPathAssets);
  await createCss(path.resolve(__dirname, 'styles'));
  await createTemplate(path.resolve(__dirname, 'components'));
}

start();

async function checkFolderExist(readFolder) {
  await fs.promises.mkdir(readFolder, { recursive: true });
}

async function readFiles(dirname, files, copyTo) {
  files.forEach((file) => {
    const { base, name } = path.parse(file.name);
    const filePath = path.resolve(dirname, base);
    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        if (stats.isFile()) {
          fs.promises.copyFile(
            path.join(dirname, base),
            path.join(copyTo, base)
          );
        }
        if (stats.isDirectory()) {
          const copyFolder = path.join(copyTo, name);
          checkFolderExist(copyFolder);
          readFolder(path.join(dirname, name), copyFolder);
        }
      }
    });
  });
}

async function readFolder(dirname, copyTo) {
  const files = await fs.promises.readdir(dirname, { withFileTypes: true });
  await readFiles(dirname, files, copyTo);
}

async function createCss(dirname) {
  const to = path.join(copyPath, bundle);
  const writeStream = fs.createWriteStream(to, 'utf8');
  const files = await fs.promises.readdir(dirname, { withFileTypes: true });
  files.forEach(async (file) => {
    const { base, ext } = path.parse(file.name);
    if (file.isFile() && ext === '.css') {
      const filePath = path.resolve(dirname, base);
      const read = await fs.promises.readFile(filePath, 'utf-8');
      await writeStream.write(read);
    }
  });
}

async function createTemplate(dirname) {
  const to = path.join(copyPath, enterPoint);
  const writeStream = fs.createWriteStream(to, 'utf8');
  let template = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8'
  );
  const files = await fs.promises.readdir(dirname, { withFileTypes: true });
  const final = await files
    .filter((a) => {
      return a.isFile() && path.extname(a.name) == '.html';
    })
    .map(async (file) => {
      const { base, name } = path.parse(file.name);
      const filePath = path.resolve(dirname, base);
      const read = await fs.promises.readFile(filePath, 'utf-8');
      return { name, text: read };
    });
  const allPromise = await Promise.all(final);
  const replaced = allPromise.reduce((acc, next) => {
    return (acc = acc.replace(`{{${next.name}}}`, next.text));
  }, template);
  await writeStream.write(replaced);
}

const fs = require('fs');
const path = require('path');

const copyPath = path.resolve(__dirname, 'files-copy');

async function start() {
  try {
    await fs.promises.rm(copyPath, { recursive: true, force: true }, (err) => {
      if (err) console.log('folder not exist');
      console.log('clear project dir');
    });
    await fs.promises.mkdir(copyPath, { recursive: true });
    await readFolder(path.resolve(__dirname, 'files'));
  } catch (e) {
    console.log(e);
  }
}

start();

async function readFiles(dirname, files) {
  console.log('DIR', dirname);
  files.forEach((file, key) => {
    const { base } = path.parse(file.name);
    const filePath = path.resolve(dirname, base);
    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        if (stats.isFile())
          fs.promises.copyFile(
            path.join(dirname, base),
            path.join(copyPath, base)
          );
      }
    });
  });
}

async function readFolder(dirname) {
  await fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else readFiles(dirname, files);
  });
}

const fs = require('fs');
const path = require('path');

const copyPath = path.resolve(__dirname, 'project-dist');
const bundle = 'bundle.css';

createCss(path.resolve(__dirname, 'styles'));

async function createCss(dirname) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}

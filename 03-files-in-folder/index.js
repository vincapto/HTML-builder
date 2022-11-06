const fs = require('fs');
const path = require('path');

readFolder(path.resolve(__dirname, 'secret-folder'));

function readFiles(dirname, files) {
  files.forEach((file) => {
    const { name, ext, base } = path.parse(file.name);
    const filePath = path.resolve(dirname, base);
    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        if (stats.isFile())
          showFile({ name, ext, size: (stats.size * 0.001).toFixed(2) });
      }
    });
  });
}

function readFolder(dirname) {
  fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else readFiles(dirname, files);
  });
}

function showFile({ name, ext, size }) {
  console.log(`${name} - ${ext.replace('.', ' ')} - ${size}kb`);
}

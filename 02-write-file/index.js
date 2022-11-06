const fs = require('fs');
const path = require('path');
const readline = require('readline');
const line = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf8');

function goodbye() {
  console.log('\nGoodbye!');
  process.exit(0);
}

function writeLine(data) {
  writeStream.write(`${data}\n`, 'utf8');
  console.log(`line "${data}" is written\n`);
}

console.log('Enter line \n');
line.on('line', (data) => {
  if (data !== 'exit') writeLine(data);
  else goodbye();
  console.log('enter next line');
});

line.on('close', goodbye);

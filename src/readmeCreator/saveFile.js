const fs = require('fs');

const saveToFile = function (filePath, content) {
  fs.writeFile(filePath, content, { overwrite: true }, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log(`The file ${filePath} was saved!`);
  });
};
const readFile = function (filePath) {
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = {
  saveToFile,
  readFile,
};

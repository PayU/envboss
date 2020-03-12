const { saveToFile, readFile } = require('./saveFile');

const HEADER = '## Environment variables';
const TITLES = ['Name', 'Required', 'Type', 'Description', 'Default', 'Valid Values'];
const NEW_LINE = '\n'
const createRow = (values) => `| ${values.map((v) => v).join('|')} |`;
const createSeparator = () => createRow(TITLES.map(() => ' - '));
const createTable = (varsConfig) => {
  let str = '';
  str += `${HEADER}\n`;
  str += `${createRow(TITLES)}\n`;
  str += `${createSeparator()}\n`;

  Object.entries(varsConfig).forEach(([paramName, config]) => {
    const required = config.mandatory ? '✓' : '';
    const values = config.validValues ? config.validValues.join(', ') : '';
    const type = config.default ? typeof config.default : config.type || 'string';
    const defaultValue = config.default || '';
    const description = config.description || '';
    str += `| ${paramName} | ${required} |  ${type} | ${description} |  ${defaultValue} | ${values} |\n`;
  });

  return str;
};

const findHookEnd = (readme) => {
  const indexOfHeader = readme.indexOf(HEADER);
  const start = indexOfHeader !== -1 ? indexOfHeader + HEADER.length + NEW_LINE.length : readme.length;
  return start;
};
const findHookStart = (readme) => {
  const indexOfHeader = readme.indexOf(HEADER);
  const start = indexOfHeader !== -1 ? indexOfHeader : readme.length;
  return start;
};

const findTableEnd = (readme, start) => {
  let position = readme.indexOf('|', start);

  while (readme.startsWith('|', position) && readme.endsWith('\n', position)) {
    const startLine = readme.indexOf('|', position);
    let endLine = readme.indexOf('\n', position);
    endLine = endLine === -1 ? readme.lastIndexOf('|', readme.length) : endLine;

    const lineLength = endLine - startLine;
    position += lineLength + NEW_LINE.length;
  }
  return position;
};

const removeOldTable = (readme) => {
  const start = findHookEnd(readme);
  const end = findTableEnd(readme, start);

  const newreadme = readme.slice(0, start) + readme.slice(end);
  return newreadme;
};
const insertNewTable = function (readme, output) {
  const start = findHookStart(readme);
  const end = findHookEnd(readme);
  const newReadme = readme.slice(0, start) + output + readme.slice(end);
  return newReadme;
};

const main = (readmePath, varsConfig) => {
  const output = createTable(varsConfig);
  let readme = readFile(readmePath);

  readme = removeOldTable(readme);
  readme = insertNewTable(readme, output);

  saveToFile(readmePath, readme);
};

module.exports.addEnvVarsToReadMe = main;
module.exports.createTable = createTable;

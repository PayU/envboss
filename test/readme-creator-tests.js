const { addEnvVarsToReadMe } = require('../src/readmeCreator');
const { mandatory } = require('../src');

const ENV_VARS_CONFIG = {
  CLUSTER: { mandatory },
  ENVIRONMENT: {
    mandatory,
    validValues: ['live', 'sandbox'],
    description: 'Service Environment',
  },
  STORAGE_PORT: { mandatory, wrappingFunction: Number, type: 'number' },
  IS_MASTER: { mandatory },
  // optional
  PORT: { default: 8082 },
  PROCESSOR_TIMEOUT: { default: 50000 },
  RETRY_TIMES: { default: 10, validationFunction: (v) => v > 3 },
  LOG_LEVEL: { default: 'info' },
};
const readmePath = './ReadMeTest.md';

addEnvVarsToReadMe(readmePath, ENV_VARS_CONFIG);
// const output = createTable( ENV_VARS_CONFIG);
// console.log(output);

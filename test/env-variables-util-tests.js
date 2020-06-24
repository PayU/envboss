const rewire = require('rewire');

let createEnvObject;
const { mandatory, Types } = rewire('../src/index');
const { expect } = require('chai');

describe('env-variables-util', () => {
  let processEnvBackup;
  beforeEach(() => {
    processEnvBackup = { ...process.env };
    createEnvObject = rewire('../src/index').createEnvObject;
  });

  afterEach(() => {
    process.env = processEnvBackup;
  });
  describe('mandatory', () => {
    describe('mandatory params was defined', () => {
      it('should return it as object', () => {
        process.env.ENV_PARAM1 = 'param1';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 'param1' });
      });
    });
    describe('mandatory params was not defined', () => {
      it('should throw an error with the values of missing params', () => {
        delete process.env.ENV_PARAM1;

        const paramsConfig = {
          ENV_PARAM1: { mandatory },
          ENV_PARAM2: { mandatory },
        };
        expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1","ENV_PARAM2"]');
      });
    });
    describe('mandatory params was not defined(empty)', () => {
      it('should throw an error with the values of missing params', () => {
        process.env.ENV_PARAM1 = ' ';
        const paramsConfig = {
          ENV_PARAM1: { mandatory },
        };
        expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1"]');
      });
    });
    describe('mandatory params was defined with empty value', () => {
      it('should throw an error with the values of missing params', () => {
        process.env.ENV_PARAM1 = '';

        const paramsConfig = {
          ENV_PARAM1: { mandatory },
        };
        expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1"]');
      });
    });
  });
  describe('default', () => {
    describe('default value was defined and the param is not defined', () => {
      it('should set the value as given by default param value', () => {
        delete process.env.ENV_PARAM1;
        const envObject = createEnvObject({
          ENV_PARAM1: { default: 200 },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 200 });
      });
    });
    describe('default value was defined,and param was also defined before', () => {
      it('should set the value as given by default param value', () => {
        process.env.ENV_PARAM1 = '300';
        const envObject = createEnvObject({
          ENV_PARAM1: { default: 200 },
        });
        expect(envObject).to.deep.equal({ ENV_PARAM1: 300 });
      });
    });
    describe('default value should be automatically be converted to  the type of default value', () => {
      describe('if its number', () => {
        it('should set the value to number', () => {
          process.env.ENV_PARAM1 = '300';
          const envObject = createEnvObject({
            ENV_PARAM1: { default: 200 },
          });
          expect(envObject).to.deep.equal({ ENV_PARAM1: 300 });
        });
      });
      describe('if its boolean', () => {
        it('should set the value to boolean', () => {
          process.env.ENV_PARAM1 = 'true';
          const envObject = createEnvObject({
            ENV_PARAM1: { default: false },
          });
          expect(envObject).to.deep.equal({ ENV_PARAM1: true });
        });
      });
      describe('if its string', () => {
        it('should set the value to string', () => {
          process.env.ENV_PARAM1 = 'abb';
          const envObject = createEnvObject({
            ENV_PARAM1: { default: 'efe' },
          });
          expect(envObject).to.deep.equal({ ENV_PARAM1: 'abb' });
        });
      });
    });
    describe('default value is undefined', () => {
      it('should set the value to undefined', () => {
        const envObject = createEnvObject({
          ENV_PARAM1: { default: undefined },
        });
        expect(envObject).to.deep.equal({ ENV_PARAM1: undefined });
      });
    });
  });
  describe('wrappingFunction', () => {
    describe('wrappingFunction was defined', () => {
      it('should apply the wrappingFunction on the value', () => {
        process.env.ENV_PARAM1 = '8200';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, wrappingFunction: (v) => Number(v) },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 8200 });
      });
    });
  });
  describe('type', () => {
    describe('type was defined as number', () => {
      it('value should be a number', () => {
        process.env.ENV_PARAM1 = '8200';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, type: Types.Number },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 8200 });
      });
    });
    describe('type was defined as boolean', () => {
      describe('boolean false', () => {
        it('should be false', () => {
          process.env.ENV_PARAM1 = 'false';
          const envObject = createEnvObject({
            ENV_PARAM1: { mandatory, type: Types.Boolean },
          });

          expect(envObject).to.deep.equal({ ENV_PARAM1: false });
        });
      });
      describe('boolean true', () => {
        it('should be true', () => {
          process.env.ENV_PARAM1 = 'true';
          const envObject = createEnvObject({
            ENV_PARAM1: { mandatory, type: Types.Boolean },
          });

          expect(envObject).to.deep.equal({ ENV_PARAM1: true });
        });
      });
    });
    describe('type was defined as string', () => {
      it('should be string', () => {
        process.env.ENV_PARAM1 = 'w123! 1';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, type: Types.String },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 'w123! 1' });
      });
    });
    describe('type was defined as array', () => {
      it('should be string', () => {
        process.env.ENV_PARAM1 = '1,a,2,b';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, type: Types.Array },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: ['1', 'a', '2', 'b'] });
      });
    });
  });
  describe('validationFunction', () => {
    describe('value is not valid by validationFunction', () => {
      it('should apply the wrappingFunction on the value', () => {
        process.env.ENV_PARAM1 = 'v33333';
        const paramsConfig = {
          ENV_PARAM1: { mandatory, validationFunction: (v) => v === 'v1' || v === 'v2' },
        };

        expect(() => createEnvObject(paramsConfig)).to.throw('value \'v33333\' of env param \'ENV_PARAM1\' is not valid, check paramsConfig to see valid values');
      });
    });
    describe('value is valid by validationFunction', () => {
      it('should apply the wrappingFunction on the value', () => {
        process.env.ENV_PARAM1 = 'v1';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, validationFunction: (v) => v === 'v1' || v === 'v2' },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 'v1' });
      });
    });
  });
  describe('validValues', () => {
    describe('value is not in validValues', () => {
      it('should apply the wrappingFunction on the value', () => {
        process.env.ENV_PARAM1 = 'v33333';
        const paramsConfig = {
          ENV_PARAM1: { mandatory, validValues: ['v2', 'v3'] },
        };

        expect(() => createEnvObject(paramsConfig)).to.throw('value \'v33333\' of env param \'ENV_PARAM1\' is not valid, check paramsConfig to see valid values');
      });
    });
    describe('value is valid and in validValues', () => {
      it('should contain the valid value', () => {
        process.env.ENV_PARAM1 = 'v1';
        const envObject = createEnvObject({
          ENV_PARAM1: { mandatory, validValues: ['v1', 'v3'] },
        });

        expect(envObject).to.deep.equal({ ENV_PARAM1: 'v1' });
      });
    });
  });

  describe('not mandatory and not default', () => {
    it('should set the value as given by default param value', () => {
      const envObject = createEnvObject({
        ENV_PARAM1: {},
      });

      expect(envObject).to.deep.equal({ ENV_PARAM1: undefined });
    });
  });
});

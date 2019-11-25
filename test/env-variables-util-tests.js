'use strict';
const rewire = require('rewire');
let createEnvObject;
const { mandatory } = rewire('../src/index');
const expect = require('chai').expect;

describe('env-variables-util', function () {
    let processEnvBackup;
    beforeEach(function () {
        processEnvBackup = { ...process.env };
        createEnvObject = rewire('../src/index').createEnvObject;
    });

    afterEach(function () {
        process.env = processEnvBackup;
    });
    describe('mandatory', function () {
        describe('mandatory params was defined', function () {
            it('should return it as object', function () {
                process.env.ENV_PARAM1 = 'param1';
                const envObject = createEnvObject({
                    ENV_PARAM1: { mandatory }
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: 'param1' });
            });
        });

        describe('mandatory params was not defined', function () {
            it('should throw an error with the values of missing params', function () {
                delete process.env.ENV_PARAM1;

                const paramsConfig = {
                    ENV_PARAM1: { mandatory },
                    ENV_PARAM2: { mandatory }
                };
                expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1","ENV_PARAM2"]');
            });
        });
        describe('mandatory params was not defined(empty)', function () {
            it('should throw an error with the values of missing params', function () {
                process.env.ENV_PARAM1 = ' ';
                const paramsConfig = {
                    ENV_PARAM1: { mandatory }
                };
                expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1"]');
            });
        });
        describe('mandatory params was defined with empty value', function () {
            it('should throw an error with the values of missing params', function () {
                process.env.ENV_PARAM1 = '';

                const paramsConfig = {
                    ENV_PARAM1: { mandatory }
                };
                expect(() => createEnvObject(paramsConfig)).to.throw('missing mandatory env variables: ["ENV_PARAM1"]');
            });
        });
    });
    describe('default', function () {
        describe('default value was defined and the param is not defined', function () {
            it('should set the value as given by default param value', function () {
                delete process.env.ENV_PARAM1;
                const envObject = createEnvObject({
                    ENV_PARAM1: { default: 200 }
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: 200 });
            });
        });
        describe('default value was defined,and param was also defined before', function () {
            it('should set the value as given by default param value', function () {
                process.env.ENV_PARAM1 = '300';
                const envObject = createEnvObject({
                    ENV_PARAM1: { default: 200 }
                });
                expect(envObject).to.deep.equal({ ENV_PARAM1: 300 });
            });
        });
        describe('default value should be automatically be converted to  the type of default value', function () {
            describe('if its number', function () {
                it('should set the value to number', function () {
                    process.env.ENV_PARAM1 = '300';
                    const envObject = createEnvObject({
                        ENV_PARAM1: { default: 200 }
                    });
                    expect(envObject).to.deep.equal({ ENV_PARAM1: 300 });
                });
            });
            describe('if its boolean', function () {
                it('should set the value to boolean', function () {
                    process.env.ENV_PARAM1 = 'true';
                    const envObject = createEnvObject({
                        ENV_PARAM1: { default: false }
                    });
                    expect(envObject).to.deep.equal({ ENV_PARAM1: true });
                });
            });
            describe('if its string', function () {
                it('should set the value to string', function () {
                    process.env.ENV_PARAM1 = 'abb';
                    const envObject = createEnvObject({
                        ENV_PARAM1: { default: 'efe' }
                    });
                    expect(envObject).to.deep.equal({ ENV_PARAM1: 'abb' });
                });
            });
        });
        describe('default value is undefined', function () {
            it('should set the value to undefined', function () {

                const envObject = createEnvObject({
                    ENV_PARAM1: { default: undefined }
                });
                expect(envObject).to.deep.equal({ ENV_PARAM1: undefined });
            });
        });
    });
    describe('wrappingFunction', function () {
        describe('wrappingFunction was defined', function () {
            it('should apply the wrappingFunction on the value', function () {
                process.env.ENV_PARAM1 = '8200';
                const envObject = createEnvObject({
                    ENV_PARAM1: { mandatory, wrappingFunction: (v) => Number(v) }
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: 8200 });
            });
        });
    });
    describe('validationFunction', function () {
        describe('value is not valid by validationFunction', function () {
            it('should apply the wrappingFunction on the value', function () {
                process.env.ENV_PARAM1 = 'v33333';
                const paramsConfig = {
                    ENV_PARAM1: { mandatory, validationFunction: (v) => v === 'v1' || v === 'v2' }
                };

                expect(() => createEnvObject(paramsConfig)).to.throw('value \'v33333\' of env param \'ENV_PARAM1\' is not valid, check paramsConfig to see valid values');
            });
        });
        describe('value is valid by validationFunction', function () {
            it('should apply the wrappingFunction on the value', function () {
                process.env.ENV_PARAM1 = 'v1';
                const envObject = createEnvObject({
                    ENV_PARAM1: { mandatory, validationFunction: (v) => v === 'v1' || v === 'v2' }
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: 'v1' });
            });
        });
    });
    describe('validValues', function () {
        describe('value is not in validValues', function () {
            it('should apply the wrappingFunction on the value', function () {
                process.env.ENV_PARAM1 = 'v33333';
                const paramsConfig = {
                    ENV_PARAM1: { mandatory, validValues: ['v2','v3'] }
                };

                expect(() => createEnvObject(paramsConfig)).to.throw('value \'v33333\' of env param \'ENV_PARAM1\' is not valid, check paramsConfig to see valid values');
            });
        });
        describe('value is valid and in validValues', function () {
            it('should contain the valid value', function () {
                process.env.ENV_PARAM1 = 'v1';
                const envObject = createEnvObject({
                    ENV_PARAM1: { mandatory, validValues: ['v1','v3'] }
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: 'v1' });
            });
        });
    });

    describe('not mandatory and not default', function () {
        it('should set the value as given by default param value', function () {
                const envObject = createEnvObject({
                    ENV_PARAM1: {}
                });

                expect(envObject).to.deep.equal({ ENV_PARAM1: undefined });
            });
    });
});
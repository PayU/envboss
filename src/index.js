const shouldValidateEnvParams = process.env.SHOULD_VALIDATE_ENV_PARAMS !== 'false';

const isEnvParamEmpty = ([paramName]) => !process.env[paramName] || process.env[paramName].trim() === '';
const isMandatory = ([, envParamConfig]) => envParamConfig.mandatory;

function validateEnvParams (paramsConfig) {
    let missingFields =
    Object.entries(paramsConfig)
        .filter(isMandatory)
        .filter(isEnvParamEmpty);

    if (missingFields.length > 0) {
        throw new Error(`missing mandatory env variables: ${JSON.stringify(missingFields.map(([paramName]) => paramName))}`);
    }
}

function applyWrappingFunction (paramName, config, value) {
    if (typeof config.wrappingFunction !== 'function') {
        throw new Error(`wrappingFunction method of '${paramName}' should be a function`);
    }
    return config.wrappingFunction(value);
}

function applyValidationFunction (paramName, config, value) {
    if (typeof config.validationFunction !== 'function') {
        throw new Error(`validationFunction method of '${paramName}' should be a function`);
    }
    if (!config.validationFunction(value)) {
        throw new Error(`value '${value}' of env param '${paramName}' is not valid, check paramsConfig to see valid values`);
    }
}

function createEnvObject (paramsConfig) {
    shouldValidateEnvParams && validateEnvParams(paramsConfig);

    let result = {};
    Object.entries(paramsConfig).forEach(([paramName, config]) => {
        let value = process.env[paramName] || config.default;

        if (config.wrappingFunction) {
            value = applyWrappingFunction(paramName, config, value);
        }

        if (shouldValidateEnvParams && config.validationFunction) {
            applyValidationFunction(paramName, config, value);
        }

        result[paramName] = value;
    });

    return result;
}

module.exports = {
    createEnvObject,
    mandatory: true
};

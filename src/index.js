
const isEnvParamEmpty = ([paramName]) => !process.env[paramName] || process.env[paramName].trim() === '';
const isMandatory = ([, envParamConfig]) => envParamConfig.mandatory;

function validateMandatoryEnvParams(paramsConfig) {
  const missingFields = Object.entries(paramsConfig)
    .filter(isMandatory)
    .filter(isEnvParamEmpty);

  if (missingFields.length > 0) {
    throw new Error(`missing mandatory env variables: ${JSON.stringify(missingFields.map(([paramName]) => paramName))}`);
  }
}

function applyWrappingFunction(paramName, wrappingFunction, value) {
  if (typeof wrappingFunction !== 'function') {
    throw new Error(`wrappingFunction method of '${paramName}' should be a function`);
  }
  return wrappingFunction(value);
}

function applyValidationFunction(paramName, config, value) {
  if (typeof config.validationFunction !== 'function') {
    throw new Error(`validationFunction method of '${paramName}' should be a function`);
  }
  if (!config.validationFunction(value)) {
    throw new Error(`value '${value}' of env param '${paramName}' is not valid, check paramsConfig to see valid values`);
  }
}
function getWrappingFunctionByDefaultValue(value) {
  let wrappingFunction;
  switch (typeof value) {
    case 'number':
      wrappingFunction = Number;
      break;
    case 'boolean':
      wrappingFunction = Boolean;
      break;
    case 'string':
      wrappingFunction = String;
      break;
    default:
      wrappingFunction = (v)=>v;
  }

  return wrappingFunction;
}

function createEnvObject(paramsConfig, shouldValidateEnvParams = true) {
  if (shouldValidateEnvParams) {
    validateMandatoryEnvParams(paramsConfig);
  }
  const result = {};
  Object.entries(paramsConfig).forEach(([paramName, config]) => {
    let value = process.env[paramName] || config.default;

    if (config.wrappingFunction) {
      value = applyWrappingFunction(paramName, config.wrappingFunction, value);
    } else {
      const wrappingFunction = getWrappingFunctionByDefaultValue(config.default);
      value = applyWrappingFunction(paramName, wrappingFunction, value);
    }

    if (shouldValidateEnvParams) {
      if (config.validationFunction) {
        applyValidationFunction(paramName, config, value);
      }

      if (config.validValues) {
        if (!config.validValues.includes(value)) {
          throw new Error(`value '${value}' of env param '${paramName}' is not valid, check paramsConfig to see valid values`);
        }
      }
    }

    result[paramName] = value;
  });

  return result;
}

module.exports = {
  createEnvObject,
  mandatory: true,
};

const isEnvParamEmpty = ([paramName]) => !process.env[paramName] || process.env[paramName].trim() === '';
const isMandatory = ([_, envParamConfig]) => envParamConfig.mandatory;

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
  const wrappingFunction = getConvertingFunctionByType(typeof value);
  return wrappingFunction;
}

function getConvertingFunctionByType(type) {
  let convertingFunc;
  switch (type) {
    case Types.Number:
      convertingFunc = Number;
      break;
    case Types.Boolean:
      convertingFunc = (v) => v === 'true';
      break;
    case Types.String:
      convertingFunc = String;
      break;
    case Types.Array:
      convertingFunc = (v) => v.split(',');
      break;
    default:
      convertingFunc = (v) => v;
  }

  return convertingFunc;
}

function convertValueToRequiredType(type, value) {
  const convertingFunction = getConvertingFunctionByType(type);
  return convertingFunction(value);
}

function createEnvObject(paramsConfig, shouldValidateEnvParams = true) {
  if (shouldValidateEnvParams) {
    validateMandatoryEnvParams(paramsConfig);
  }
  const result = {};
  Object.entries(paramsConfig)
    .forEach(([paramName, config]) => {
      let value = process.env[paramName] || config.default;

      if (config.type) {
        value = convertValueToRequiredType(config.type, value);
      } else if (config.wrappingFunction) {
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

const Types = {
  Number: 'number',
  Boolean: 'boolean',
  String: 'string',
  Array: 'Array',
};

module.exports = {
  createEnvObject,
  mandatory: true,
  Types,
};

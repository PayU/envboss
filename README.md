# env-vars-config
This package helps you organize all environment variables in one place.
It takes each <ENV_PARAM_NAME> from `process.env` and creates an envionmentVariables object with `process.env[<ENV_PARAM_NAME>]`
as it's value, so you can require it from anywhere.

If you wouldn't like to validate envparams(e.g. in tests) pass pass false to 
```createEnvObject(ENV_VARS_CONFIG,false)```

`validationFunction` - will help you validate the values.

`validValues`- lets you describe what values are valid. 

`wrappingFunction` - converts the envparam value to the given value. By default,
if `default` value is provided, `process.env[<ENV_PARAM_NAME>]` value will be converted to the type default's value type


```javascript
/// envVariablesConfig.js

const { createEnvObject, mandatory } = require('env-vars-config');

const ENV_VARS_CONFIG = {
    CLUSTER: { mandatory },
    ENVIRONMENT: { mandatory, validValues: ['live', 'sandbox']},
    STORAGE_PORT: { mandatory, wrappingFunction: Number },
    IS_MASTER: { mandatory },
    // optional
    PORT: { default: 8082 },
    PROCESSOR_TIMEOUT: { default: 50000},
    RETRY_TIMES: { default: 10, validationFunction: (v) => v > 3},
    LOG_LEVEL: { default: 'info' }
};

module.exports = createEnvObject(ENV_VARS_CONFIG);
```

```javascript
/// someFile.js
const { ENVIRONMENT } = require('envVariavbesConfig.js');
```

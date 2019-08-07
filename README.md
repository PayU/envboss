# env-vars-config
This package helps you organize all environment variables in one place
it take each <ENV_PARAM_NAME> from process.env and creates an envionmentVariables object with process.env[<ENV_PARAM_NAME>]
Each env

`validationFunction` - will help you validate the values


wrappingFunction - converts the envparam value to the given value


```javascript
/// envVariablesConfig.js

const { createEnvObject, mandatory } = require('env-vars-config');

const ENV_VARS_CONFIG = {
    CLUSTER: { mandatory },
    ENVIRONMENT: { mandatory, validationFunction: (v) => v === 'live' || v === 'sandbox' },
    SERVICE_URL: { mandatory },
    NOTIFICATIONS_URL: { mandatory },
    // optional
    PORT: { default: 8082, wrappingFunction: Number },
    PROCESSOR_TIMEOUT: { default: 50000, wrappingFunction: Number },
    LOG_LEVEL: { default: 'info' }
};

module.exports = createEnvObject(ENV_VARS_CONFIG);
```

```javascript
/// someFile.js
const { ENVIRONMENT } = require('envVariavbesConfig.js');
```

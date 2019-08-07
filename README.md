# env-vars-config
This package helps you organize all environment variables in one place


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
const {ENVIRONMENT} = require('envVariavlesConfig.js');
```
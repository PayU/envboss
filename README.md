[![Known Vulnerabilities](https://snyk.io/test/github/yuriabaevzooz/env-vars-config/badge.svg?targetFile=package.json)](https://snyk.io/test/github/yuriabaevzooz/env-vars-config?targetFile=package.json)
[![Build Status](https://travis-ci.com/yuriabaevzooz/env-vars-config.svg?branch=master)](https://travis-ci.com/yuriabaev/env-vars-config)
[![Coverage Status](https://coveralls.io/repos/github/yuriabaevzooz/env-vars-config/badge.svg?branch=master)](https://coveralls.io/github/yuriabaevzooz/env-vars-config?branch=master)

# env-vars-config
This package helps you organize and validate all your environment variables in one place.

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

import { createEnvObject, mandatory } from 'env-vars-config';

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

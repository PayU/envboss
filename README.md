[![Known Vulnerabilities](https://snyk.io/test/github/PayU/envboss/badge.svg?targetFile=package.json)](https://snyk.io/test/github/PayU/envboss?targetFile=package.json)
[![Build Status](https://travis-ci.com/PayU/envboss.svg?branch=master)](https://travis-ci.com/PayU/envboss)
[![Coverage Status](https://coveralls.io/repos/github/PayU/envboss/badge.svg?branch=master)](https://coveralls.io/github/PayU/envboss?branch=master)
![GitHub](https://img.shields.io/github/license/PayU/envboss)
![npm (scoped)](https://img.shields.io/npm/v/envboss)

# EnvBoss 
Tired of using `process.env` everywhere in the code?<br>
Tired of guessing which environment variable are `mandatory` and which are `optional`?<br>
Tired of validating environment params?

meet `EnvBoss!!!` 

This package will help you organize and validate all your environment variables in one place.


***Installation***
```bash
> npm i envboss
``` 
 
## How to use 

```javascript
/// envVariablesConfig.js

import { createEnvObject, mandatory, Types } from 'envboss';

const ENV_VARS_CONFIG = {
    CLUSTER: { mandatory: true },
    ENVIRONMENT: { mandatory, validValues: ['live', 'sandbox']},
    IS_MASTER: { mandatory, type: Types.Boolean },
    IP_ADDRESSES_ARR: { mandatory, type: Types.Array }, //resolves as array of ip addresses
    STORAGE_PORT: { mandatory, wrappingFunction: someFunc },

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

## How does it work?
It goes over the configuration you provide, and returns an object where the `key` is the `<ENV_PARAM_NAME>` and the value is `process.env[<ENV_PARAM_NAME>]` after it was validated and sanitized.
 
### configuration

`mandatory` - when set to true, sets this param as mandatory. Can be used as `mandatory` only when required from 'envboss';

`default` - lets you define a default value.

`type` - converts the given envParam value from 'string' to given Type. Supported types: `Number, Boolean, String, Array`. By default,
if `default` config is provided, `process.env[<ENV_PARAM_NAME>]` value will be converted to the type default's value type 

`validationFunction` - will help you validate the values.

`validValues`- lets you describe what values are valid. 

`wrappingFunction` - converts the envparam value to the given value. 

If you wouldn't like to validate envparams (e.g. in tests) pass false to 
```createEnvObject(ENV_VARS_CONFIG,false)```

 

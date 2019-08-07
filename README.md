# envVars

```javascript
'use strict';

const { createEnvObject, mandatory } = require('./env-variables-util');

const ENV_VARS_CONFIG = {
    SERVICE_IAM_USERNAME: { mandatory },
    SERVICE_IAM_PASSWORD: { mandatory },
    CLUSTER: { mandatory },
    ENVIRONMENT: { mandatory, validationFunction: (v) => v === 'live' || v === 'sandbox' },
    FSS_URL: { mandatory },
    RESULTS_MAPPING_URL: { mandatory },
    PAYMENT_STORAGE_URL: { mandatory },
    TASK_SCHEDULER_URL: { mandatory },
    KEY_SPACE: { mandatory },
    CASSANDRA_URL: { mandatory },
    CASSANDRA_USERNAME: { mandatory },
    CASSANDRA_PASSWORD: { mandatory },
    PROXY_NAME: { mandatory },
    PROXY_URL: { mandatory },
    GECAD_URL: { mandatory },
    CALLBACKS_URL: { mandatory },
    PCS_URL: { mandatory },
    NOTIFICATIONS_URL: { mandatory },
    // optional
    PORT: { default: 8082, wrappingFunction: Number },
    PROCESSOR_TIMEOUT: { default: 50000, wrappingFunction: Number },
    LOG_LEVEL: { default: 'info' },
    PAYMENT_STATUS_RETRY_INTERVAL: { default: 600000, wrappingFunction: Number },
    PROCESSOR_QUERY_TIMEOUT: { default: 10000, wrappingFunction: Number },
    FSS_REFRESH_TOKEN_INTERVAL: { default: 7200, wrappingFunction: Number },
    NEW_CONNECTIONS_TIMEOUT: { default: 7500, wrappingFunction: Number },
    SHUTDOWN_TIMEOUT: { default: 60000, wrappingFunction: Number },
    NOTIFICATION_BACKOFF_BASE: { default: 5, wrappingFunction: Number }

};

module.exports = () => createEnvObject(ENV_VARS_CONFIG);
```
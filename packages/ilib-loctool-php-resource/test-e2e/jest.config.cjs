const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-php-resource e2e",
        color: "greenBright",
    },
};

module.exports = config;

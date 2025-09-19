const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-php-resource",
        color: "yellowBright",
    }
}


module.exports = config;


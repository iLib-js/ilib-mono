const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-php-resource",
        color: "yellowBright",
    },
};

module.exports = config;

const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-php-resource",
        color: "yellowBright",
    },
};

module.exports = config;

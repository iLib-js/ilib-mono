const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-php-resource",
        color: "yellowBright",
    },
};

module.exports = config;

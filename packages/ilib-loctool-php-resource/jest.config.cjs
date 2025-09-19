const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-php-resource",
        color: "yellowBright",
    }
}


module.exports = config;


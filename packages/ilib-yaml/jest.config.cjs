const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    }
}


module.exports = config;


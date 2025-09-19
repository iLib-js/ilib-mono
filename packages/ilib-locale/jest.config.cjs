const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    }
}


module.exports = config;


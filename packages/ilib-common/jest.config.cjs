const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-common",
        color: "blackBright",
    }
}


module.exports = config;


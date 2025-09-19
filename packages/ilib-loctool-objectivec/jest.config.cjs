const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    }
}


module.exports = config;


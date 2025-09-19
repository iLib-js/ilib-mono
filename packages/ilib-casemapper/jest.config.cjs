const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    }
}


module.exports = config;


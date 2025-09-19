const baseConfig = require("../ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    }
}


module.exports = config;


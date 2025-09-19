const baseConfig = require("../ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    }
}


module.exports = config;


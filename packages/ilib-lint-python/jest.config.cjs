const baseConfig = require("../ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python",
        color: "yellow",
    },
}


module.exports = config;

const baseConfig = require("../ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python-gnu",
        color: "green",
    },
}


module.exports = config;

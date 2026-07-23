const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    },
};

module.exports = config;

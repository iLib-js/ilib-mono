const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    },
};

module.exports = config;

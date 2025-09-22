const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    },
};

module.exports = config;

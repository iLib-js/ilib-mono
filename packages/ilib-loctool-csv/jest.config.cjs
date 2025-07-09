const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-csv",
        color: "blackBright",
    },
};

module.exports = config;

const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-html",
        color: "blue",
    },
};

module.exports = config;

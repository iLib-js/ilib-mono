const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    },
};

module.exports = config;

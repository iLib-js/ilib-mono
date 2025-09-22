const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    },
};

module.exports = config;

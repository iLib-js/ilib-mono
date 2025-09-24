const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    },
};

module.exports = config;

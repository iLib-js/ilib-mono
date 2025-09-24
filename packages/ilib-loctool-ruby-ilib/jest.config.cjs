const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    },
};

module.exports = config;

const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    },
};

module.exports = config;

const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ruby-ilib",
        color: "whiteBright",
    }
}


module.exports = config;


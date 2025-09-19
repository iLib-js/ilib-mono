const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-java",
        color: "magenta",
    }
}


module.exports = config;


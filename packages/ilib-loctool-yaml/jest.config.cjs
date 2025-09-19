const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml",
        color: "magenta",
    }
}


module.exports = config;


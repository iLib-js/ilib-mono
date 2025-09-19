const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml-resource",
        color: "cyan",
    }
}


module.exports = config;


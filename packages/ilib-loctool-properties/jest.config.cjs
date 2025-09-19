const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    }
}


module.exports = config;


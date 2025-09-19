const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jsx",
        color: "greenBright",
    }
}


module.exports = config;


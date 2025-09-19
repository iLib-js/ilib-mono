const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    }
}


module.exports = config;


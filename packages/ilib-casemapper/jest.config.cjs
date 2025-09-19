const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    }
}


module.exports = config;


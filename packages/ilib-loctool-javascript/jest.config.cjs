const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript",
        color: "cyan",
    }
}


module.exports = config;


const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    }
}


module.exports = config;


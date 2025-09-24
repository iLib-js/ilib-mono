const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    },
};

module.exports = config;

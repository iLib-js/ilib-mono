const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    },
};

module.exports = config;

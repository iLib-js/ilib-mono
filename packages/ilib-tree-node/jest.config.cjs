const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    },
};

module.exports = config;

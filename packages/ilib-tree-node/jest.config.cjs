const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    },
};

module.exports = config;

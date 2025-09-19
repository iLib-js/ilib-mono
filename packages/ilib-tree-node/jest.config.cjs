const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tree-node",
        color: "greenBright",
    }
}


module.exports = config;


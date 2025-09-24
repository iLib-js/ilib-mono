const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jsx",
        color: "greenBright",
    },
};

module.exports = config;

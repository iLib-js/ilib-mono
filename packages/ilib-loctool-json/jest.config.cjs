const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-json",
        color: "blackBright",
    },
};

module.exports = config;

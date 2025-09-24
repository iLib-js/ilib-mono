const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-strings",
        color: "blackBright",
    },
};

module.exports = config;

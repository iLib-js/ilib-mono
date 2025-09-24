const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    },
};

module.exports = config;

const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-common",
        color: "blackBright",
    },
};

module.exports = config;

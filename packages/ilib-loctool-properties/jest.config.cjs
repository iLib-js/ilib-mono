const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    },
};

module.exports = config;

const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po",
        color: "blueBright",
    },
};

module.exports = config;

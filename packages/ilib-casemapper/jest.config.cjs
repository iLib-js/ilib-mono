const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    },
};

module.exports = config;

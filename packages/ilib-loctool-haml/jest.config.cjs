const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-haml",
        color: "yellow",
    },
};

module.exports = config;

const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-java",
        color: "magenta",
    },
};

module.exports = config;

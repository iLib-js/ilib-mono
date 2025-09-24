const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml",
        color: "magenta",
    },
};

module.exports = config;

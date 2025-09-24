const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-haml",
        color: "yellow",
    },
};

module.exports = config;

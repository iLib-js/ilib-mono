const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po e2e",
        color: "yellow",
    },
};

module.exports = config;

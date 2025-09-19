const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po e2e",
        color: "yellow",
    },
};

module.exports = config;

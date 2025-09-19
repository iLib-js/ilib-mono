const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint e2e",
        color: "blackBright",
    },
};

module.exports = config;

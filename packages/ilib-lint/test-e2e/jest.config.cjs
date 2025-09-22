const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint e2e",
        color: "blackBright",
    },
};

module.exports = config;

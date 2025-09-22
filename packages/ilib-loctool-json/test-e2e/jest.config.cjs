const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-json e2e",
        color: "blackBright",
    },
};

module.exports = config;

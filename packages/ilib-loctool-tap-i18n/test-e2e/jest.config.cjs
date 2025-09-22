const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n e2e",
        color: "white",
    },
};

module.exports = config;

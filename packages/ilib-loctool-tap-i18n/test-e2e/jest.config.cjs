const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n e2e",
        color: "white",
    },
};

module.exports = config;

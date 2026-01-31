const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n e2e",
        color: "white",
    },
    testTimeout: 15000,
};

module.exports = config;

const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-json e2e",
        color: "blackBright",
    },
    testTimeout: 15000,
};

module.exports = config;

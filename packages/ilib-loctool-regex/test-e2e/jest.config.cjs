const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-regex e2e",
        color: "magenta",
    },
    testTimeout: 15000,
};

module.exports = config;

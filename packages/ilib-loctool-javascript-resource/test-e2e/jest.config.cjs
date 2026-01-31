const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource e2e",
        color: "cyan",
    },
    testTimeout: 15000,
};

module.exports = config;

const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ghfm e2e",
        color: "red",
    },
};

module.exports = config;

const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po e2e",
        color: "yellow",
    },
};

module.exports = config;

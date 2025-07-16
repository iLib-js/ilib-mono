const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource e2e",
        color: "cyan",
    },
};

module.exports = config;

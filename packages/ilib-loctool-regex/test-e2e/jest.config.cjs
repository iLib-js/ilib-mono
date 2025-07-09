const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex e2e",
        color: "magenta",
    },
};

module.exports = config;

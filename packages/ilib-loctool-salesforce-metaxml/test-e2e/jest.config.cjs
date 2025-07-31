const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml e2e",
        color: "blue",
    },
};

module.exports = config;

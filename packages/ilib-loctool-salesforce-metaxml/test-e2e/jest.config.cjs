const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml e2e",
        color: "blue",
    },
};

module.exports = config;

const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml",
        color: "black",
    },
};

module.exports = config;

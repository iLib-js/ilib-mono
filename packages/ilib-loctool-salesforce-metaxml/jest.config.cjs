const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml",
        color: "black",
    },
};

module.exports = config;

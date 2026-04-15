const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml",
        color: "black",
    },
};

module.exports = config;

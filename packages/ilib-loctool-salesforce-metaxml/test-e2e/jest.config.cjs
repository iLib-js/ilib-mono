const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-salesforce-metaxml e2e",
        color: "blue",
    },
};

module.exports = config;

const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-mdx e2e",
        color: "orange",
    },
    testTimeout: 15000,
};

module.exports = config;

const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-xml e2e",
        color: "green",
    },
};

module.exports = config;

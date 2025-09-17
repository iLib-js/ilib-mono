const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-xml e2e",
        color: "green",
    },
};

module.exports = config;

const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource e2e",
        color: "cyan",
    },
};

module.exports = config;

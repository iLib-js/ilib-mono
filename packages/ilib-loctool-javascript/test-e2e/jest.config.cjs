const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript e2e",
        color: "blue",
    },
};

module.exports = config;

const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex e2e",
        color: "magenta",
    },
};

module.exports = config;

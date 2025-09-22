const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex e2e",
        color: "magenta",
    },
};

module.exports = config;

const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource e2e",
        color: "cyan",
    },
};

module.exports = config;

const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript e2e",
        color: "blue",
    },
};

module.exports = config;

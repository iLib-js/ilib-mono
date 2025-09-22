const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-xml e2e",
        color: "green",
    },
};

module.exports = config;

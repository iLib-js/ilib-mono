const { tsJestE2eConfig } = require("ilib-internal");

const config = {
    ...tsJestE2eConfig,
    displayName: {
        name: "ilib-scriptinfo e2e",
        color: "blue",
    },
};

module.exports = config;
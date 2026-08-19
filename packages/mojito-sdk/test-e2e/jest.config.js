const { tsJestE2eConfig } = require("ilib-internal");

const config = {
    ...tsJestE2eConfig,
    displayName: {
        name: "mojito-sdk e2e",
        color: "blue",
    },
};

module.exports = config;

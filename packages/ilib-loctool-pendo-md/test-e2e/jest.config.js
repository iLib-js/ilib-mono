const { tsJestE2eConfig } = require("ilib-internal");

const config = {
    ...tsJestE2eConfig,
    displayName: {
        name: "ilib-loctool-pendo-md e2e",
        color: "cyan",
    },
};

module.exports = config;

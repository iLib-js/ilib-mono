const { tsJestE2eConfig } = require("ilib-internal");

const config = {
    ...tsJestE2eConfig,
    displayName: {
        name: "ilib-zic e2e",
        color: "blue",
    },
};

module.exports = config;

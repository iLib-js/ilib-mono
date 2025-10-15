const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-lint e2e webOS",
        color: "blackBright",
    },
};

module.exports = config;

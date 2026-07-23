const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "loctool e2e",
        color: "blueBright",
    },
};

module.exports = config;

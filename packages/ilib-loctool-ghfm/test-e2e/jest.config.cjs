const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-ghfm e2e",
        color: "blackBright",
    },
};

module.exports = config;

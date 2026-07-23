const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-po e2e",
        color: "yellow",
    },
};

module.exports = config;

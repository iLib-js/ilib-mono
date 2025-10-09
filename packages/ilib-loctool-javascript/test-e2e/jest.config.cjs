const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-javascript e2e",
        color: "blue",
    },
};

module.exports = config;

const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-xml e2e",
        color: "green",
    },
};

module.exports = config;

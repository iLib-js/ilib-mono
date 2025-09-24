const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-regex",
        color: "cyanBright",
    },
};

module.exports = config;

const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    },
};

module.exports = config;

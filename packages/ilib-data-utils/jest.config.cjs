const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-data-utils",
        color: "greenBright",
    },
};

module.exports = config;

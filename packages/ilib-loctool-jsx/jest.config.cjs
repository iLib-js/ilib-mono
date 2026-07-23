const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-jsx",
        color: "greenBright",
    },
};

module.exports = config;

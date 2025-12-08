const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    },
};

module.exports = config;

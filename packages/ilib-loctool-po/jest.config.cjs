const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-po",
        color: "blueBright",
    },
};

module.exports = config;

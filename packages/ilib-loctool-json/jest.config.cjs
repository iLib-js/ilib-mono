const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-json",
        color: "blackBright",
    },
};

module.exports = config;

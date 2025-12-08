const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-strings",
        color: "blackBright",
    },
};

module.exports = config;

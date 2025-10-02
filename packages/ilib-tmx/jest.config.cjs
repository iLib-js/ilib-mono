const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    },
};

module.exports = config;

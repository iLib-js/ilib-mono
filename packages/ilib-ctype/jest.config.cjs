const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-ctype",
        color: "blackBright",
    },
};

module.exports = config;

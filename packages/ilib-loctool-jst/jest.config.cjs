const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-jst",
        color: "blackBright",
    },
};

module.exports = config;

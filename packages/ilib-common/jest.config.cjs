const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-common",
        color: "blackBright",
    },
};

module.exports = config;

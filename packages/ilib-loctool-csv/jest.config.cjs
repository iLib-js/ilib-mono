const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-csv",
        color: "blackBright",
    },
};

module.exports = config;

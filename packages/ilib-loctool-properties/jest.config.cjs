const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    },
};

module.exports = config;

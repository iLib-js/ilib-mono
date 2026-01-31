const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-opeanapi",
        color: "blue",
    },
};

module.exports = config;

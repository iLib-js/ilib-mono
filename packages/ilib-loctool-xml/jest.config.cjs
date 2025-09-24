const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-xml",
        color: "blue",
    },
};

module.exports = config;

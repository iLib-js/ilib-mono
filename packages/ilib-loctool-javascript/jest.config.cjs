const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-javascript",
        color: "cyan",
    },
};

module.exports = config;

const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-haml",
        color: "yellow",
    },
};

module.exports = config;

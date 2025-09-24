const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-yaml",
        color: "magenta",
    },
};

module.exports = config;

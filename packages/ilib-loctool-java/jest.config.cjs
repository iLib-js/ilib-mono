const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-java",
        color: "magenta",
    },
};

module.exports = config;

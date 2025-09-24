const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-html",
        color: "blue",
    },
};

module.exports = config;

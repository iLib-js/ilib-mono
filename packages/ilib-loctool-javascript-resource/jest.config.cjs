const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource",
        color: "white",
    },
};

module.exports = config;

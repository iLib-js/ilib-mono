const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource",
        color: "white",
    },
};

module.exports = config;

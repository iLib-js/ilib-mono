const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript-resource",
        color: "white",
    },
};

module.exports = config;

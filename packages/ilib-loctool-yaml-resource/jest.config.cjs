const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-yaml-resource",
        color: "cyan",
    },
};

module.exports = config;

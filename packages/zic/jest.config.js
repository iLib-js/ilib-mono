const { tsJestConfig } = require("ilib-internal");

const config = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-zic",
        color: "blue",
    },
};

module.exports = config;

const { tsJestConfig } = require("ilib-internal");

const config = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-glyphstring",
        color: "yellow",
    },
};

module.exports = config;

const { tsJestConfig } = require("ilib-internal");

const config = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
}

module.exports = config;
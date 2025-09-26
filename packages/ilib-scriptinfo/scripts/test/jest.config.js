const { tsJestConfig } = require("ilib-internal");

const config = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tools/",
        "/coverage/",
    ]
}

module.exports = config;
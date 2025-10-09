const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "env-browser.test.js"
    ]
}

module.exports = config;

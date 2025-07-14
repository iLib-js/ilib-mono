const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
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


/** @type {import('ts-jest').JestConfigWithTsJest} **/
const baseConfig = require("ilib-internal/ts-jest.config.js");

module.exports = {
    ...baseConfig,
    displayName: {
        name: "ilib-po",
        color: "white",
    },
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
    rootDir: "test",
    setupFiles: ["<rootDir>/../jest.setup.js"],
};

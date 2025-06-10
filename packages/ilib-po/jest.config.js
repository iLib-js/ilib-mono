/** @type {import('ts-jest').JestConfigWithTsJest} **/
const baseConfig = require("../../jest.config.js");

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

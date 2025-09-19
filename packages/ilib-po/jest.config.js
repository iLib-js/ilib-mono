/** @type {import('ts-jest').JestConfigWithTsJest} **/
const { tsJestConfig: baseConfig } = require("ilib-common-config");

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

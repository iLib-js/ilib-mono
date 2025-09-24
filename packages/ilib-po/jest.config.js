const { tsJestConfig } = require("ilib-internal");

module.exports = {
    ...tsJestConfig,
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

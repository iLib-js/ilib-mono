const { tsJestConfig: baseConfig } = require("ilib-internal");

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

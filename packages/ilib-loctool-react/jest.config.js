/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
    rootDir: "src",
    setupFiles: ["<rootDir>/../jest.setup.js"],
};

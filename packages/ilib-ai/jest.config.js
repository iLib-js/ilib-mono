const { tsJestConfig } = require("ilib-internal");

/** Unit tests only (`tests/`). Integration tests use `jest.integration.config.cjs` via `pnpm test:integration`. */
module.exports = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-ai",
        color: "blackBright",
    },
    testMatch: ["<rootDir>/tests/**/*.test.?(c|m)(j|t)s"],
    testPathIgnorePatterns: [
        "<rootDir>/test-integration/",
        "<rootDir>/node_modules/",
        "<rootDir>/lib/",
    ],
};

/* eslint-disable @typescript-eslint/no-require-imports */
const { tsJestConfig } = require("ilib-internal");

/** Integration tests only (`test-integration/`). Unit tests use `jest.config.js` via `pnpm test`. */
module.exports = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-ai-integration",
        color: "blueBright",
    },
    testMatch: ["<rootDir>/test-integration/**/*.test.ts"],
    testPathIgnorePatterns: [
        "<rootDir>/tests/",
        "<rootDir>/node_modules/",
        "<rootDir>/lib/",
    ],
    testTimeout: 120000,
    maxWorkers: 1,
};

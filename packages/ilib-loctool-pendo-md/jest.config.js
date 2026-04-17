const { tsJestConfig } = require("ilib-internal");

module.exports = {
    ...tsJestConfig,
    displayName: {
        name: "ilib-loctool-pendo-md",
        color: "cyan",
    },
    globalTeardown: "<rootDir>/test-e2e/globalTeardown.ts",
};

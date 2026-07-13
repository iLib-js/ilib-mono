const { tsJestE2eConfig } = require("ilib-internal");

/** E2E tests (`test-e2e/`). Not run by default `pnpm test`. */
module.exports = {
    ...tsJestE2eConfig,
    displayName: {
        name: "ilib-ai e2e",
        color: "blue",
    },
    testTimeout: 120000,
    maxWorkers: 1,
};

const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo e2e",
        color: "blue",
    },
    preset: "ts-jest/presets/default-esm",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": ["ts-jest", {
            useESM: true,
        }],
    },
};

module.exports = config; 
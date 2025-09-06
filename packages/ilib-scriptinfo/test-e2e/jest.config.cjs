const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo e2e",
        color: "blue",
    },
    preset: "ts-jest/presets/default",
    transform: {
        "^.+\\.ts$": ["ts-jest", {}],
    },
};

module.exports = config; 
const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                types: ['jest', 'node'],
                module: 'ES2020',
                moduleResolution: 'node'
            }
        }]
    }
}

module.exports = config;
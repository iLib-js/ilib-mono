const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
    preset: undefined,
    testMatch: [
        "**/test/**/*.test.ts"
    ],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                types: ['jest', 'node']
            }
        }]
    },
    extensionsToTreatAsEsm: ['.ts']
}

module.exports = config; 
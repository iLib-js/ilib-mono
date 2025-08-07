const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
    preset: undefined,
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                types: ['jest', 'node']
            }
        }]
    },
    testMatch: [
        "**/test/**/*.test.ts"
    ],
    moduleFileExtensions: ['ts', 'js']
}

module.exports = config; 
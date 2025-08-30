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
            tsconfig: {
                types: ['jest', 'node']
            }
        }]
    }
}

module.exports = config; 
const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    preset: 'ts-jest',
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
            tsconfig: {
                types: ['jest', 'node'],
                module: 'CommonJS',
                moduleResolution: 'node'
            }
        }]
    }
}

module.exports = config;
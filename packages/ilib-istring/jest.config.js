module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/test/*.test.js'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/test/package.json'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    transform: {
        '^.+\\.js$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ]
        }]
    }
}; 
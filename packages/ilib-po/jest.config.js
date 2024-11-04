const ignores = ['node_modules', '__mocks__', 'dist'];

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    },
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePathIgnorePatterns: ['<rootDir>/src/.*/__mocks__/'],
    reporters: ['default'],
    testPathIgnorePatterns: ignores,
    coveragePathIgnorePatterns: [...ignores, 'test-utils', '__tests__'],
    // Enable transform to CJS for all ESM-only packages
    //transformIgnorePatterns: [
    //    'node_modules/(?!(ilib-.*)/)',
    //],
    testTimeout: 30000
};

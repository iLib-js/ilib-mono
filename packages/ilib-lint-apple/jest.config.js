import baseConfig from '../../jest.config.js';

export default {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-lint-apple",
        color: "blue"
    }
}; 
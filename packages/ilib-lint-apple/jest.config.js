import baseConfig from '../ilib-common-config/jest-esm.config.js';

const config = {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-lint-apple",
        color: "blue"
    }
};

export default config; 
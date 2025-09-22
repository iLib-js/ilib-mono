import baseConfig from "ilib-internal/jest.config.js";

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint",
        color: "blackBright",
    },
};

export default config;

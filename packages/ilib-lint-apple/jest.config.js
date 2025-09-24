import { jestEsmConfig as baseConfig } from "ilib-internal";

const config = {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-lint-apple",
        color: "blue",
    },
};

export default config;

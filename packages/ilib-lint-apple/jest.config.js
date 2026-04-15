import { jestEsmConfig } from "ilib-internal";

const config = {
    ...jestEsmConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-lint-apple",
        color: "blue",
    },
};

export default config;

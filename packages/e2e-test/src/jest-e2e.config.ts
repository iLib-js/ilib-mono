import type { Config } from "jest";

const config: Config = {
    displayName: {
        name: "ilib-mono e2e",
        color: "blackBright",
    },
    testMatch: ["**/*.e2e.test.?(c|m)(j|t)s"],
};

export default config;

import baseConfig from "ilib-internal/jest-esm.config.js";

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-react",
        color: "blue",
    },
    moduleFileExtensions: ["js", "jsx", "json"],
    transform: {},
    transformIgnorePatterns: ["/node_modules/"],
    moduleDirectories: ["node_modules", "src"],
};

export default config;

const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-mdx",
        color: "orange",
    },
    // ESM configuration to handle dynamic imports of remark plugins
    // Don't transform ESM packages - let them be loaded as-is by Node.js
    transformIgnorePatterns: [
        '/node_modules/(?!(ilib-.*|remark|remark-.*|micromark|micromark-.*|unified|unist-.*|vfile|mdast|hast|rehype|rehype-.*)/)'
    ],
    // Use node environment for proper ESM support
    testEnvironment: 'node',
};

module.exports = config;

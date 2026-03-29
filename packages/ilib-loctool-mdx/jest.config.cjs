const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-mdx",
        color: "orange",
    }
};

module.exports = config;

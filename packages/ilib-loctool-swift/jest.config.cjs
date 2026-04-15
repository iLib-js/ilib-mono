const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-swift",
        color: "green",
    },
};

module.exports = config;

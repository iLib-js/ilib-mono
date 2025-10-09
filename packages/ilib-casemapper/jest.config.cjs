const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    },
};

module.exports = config;

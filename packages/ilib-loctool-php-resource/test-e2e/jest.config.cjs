const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-php-resource e2e",
        color: "greenBright",
    },
};

module.exports = config;

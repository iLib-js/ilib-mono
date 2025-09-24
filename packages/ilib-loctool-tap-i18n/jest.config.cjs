const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    },
};

module.exports = config;

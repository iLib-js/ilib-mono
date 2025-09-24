const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    },
};

module.exports = config;

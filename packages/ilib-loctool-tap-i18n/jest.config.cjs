const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    },
};

module.exports = config;

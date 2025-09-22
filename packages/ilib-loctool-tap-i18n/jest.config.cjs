const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    },
};

module.exports = config;

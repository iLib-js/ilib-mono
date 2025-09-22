const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    },
};

module.exports = config;

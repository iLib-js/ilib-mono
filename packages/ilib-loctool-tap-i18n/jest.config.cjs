const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-tap-i18n",
        color: "yellow",
    }
}


module.exports = config;


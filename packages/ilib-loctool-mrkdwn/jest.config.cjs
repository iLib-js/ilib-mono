const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn",
        color: "black",
    },
}

module.exports = config;

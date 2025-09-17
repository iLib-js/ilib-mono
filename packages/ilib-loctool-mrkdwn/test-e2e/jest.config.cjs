const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn e2e",
        color: "green",
    },
};

module.exports = config;

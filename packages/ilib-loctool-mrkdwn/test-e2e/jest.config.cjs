const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn e2e",
        color: "green",
    },
};

module.exports = config;

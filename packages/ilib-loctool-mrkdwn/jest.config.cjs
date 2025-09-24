const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn",
        color: "black",
    },
};

module.exports = config;

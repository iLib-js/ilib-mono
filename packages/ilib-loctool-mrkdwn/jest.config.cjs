const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn",
        color: "black",
    },
};

module.exports = config;

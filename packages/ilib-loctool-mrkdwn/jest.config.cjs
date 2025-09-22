const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn",
        color: "black",
    },
};

module.exports = config;

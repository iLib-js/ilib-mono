const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn e2e",
        color: "green",
    },
    testTimeout: 15000,
};

module.exports = config;

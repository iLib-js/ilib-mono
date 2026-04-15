const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-mrkdwn",
        color: "black",
    },
};

module.exports = config;

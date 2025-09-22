const { createKarmaConfig } = require("ilib-internal");

module.exports = function (config) {
    config.set(
        createKarmaConfig({
            // Package-specific files to load (shared karma-setup.js is added automatically)
            files: ["./test/**/*.test.js"],

            // Package-specific preprocessors
            preprocessors: {
                "./test/**/*.test.js": ["webpack"],
            },
        })
    );
};

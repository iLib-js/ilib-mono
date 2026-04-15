const { createKarmaConfig } = require("ilib-internal");

module.exports = function (config) {
    config.set(
        createKarmaConfig({
            type: "typescript",
            files: ["./test/*.test.ts"],
        })
    );
};

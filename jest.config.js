const config = {
    displayName: "ilib-mono root",
    coverageReporters: ["html", "json-summary", ["text", { file: "../coverage.txt" }]],
    reporters: ["default", ["jest-junit", { outputName: "junit.xml" }]],
    testMatch: ["**/__tests__/**/*.?([mc])[jt]s?(x)", "**/test/**/?(*.)+(spec|test).?([mc])[jt]s?(x)"],
};

module.exports = config;

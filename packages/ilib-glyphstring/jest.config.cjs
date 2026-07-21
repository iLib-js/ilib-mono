const config = {
    coverageReporters: [
        "html",
        "json-summary",
        ["text", {"file": "coverage.txt"}],
    ],
    reporters: [
        "default",
        ['jest-junit', {outputName: 'junit.xml'}],
    ],
    displayName: {
        name: "ilib-glyphstring",
        color: "yellow",
    },
}

module.exports = config;

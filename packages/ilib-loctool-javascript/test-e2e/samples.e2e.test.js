const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("js", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-js-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });

    describe("js-json", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js-json");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-js-json-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });

    describe("php-resource", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "php-resource");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-php-resource-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});

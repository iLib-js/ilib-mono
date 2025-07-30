const path = require("path");
const fs = require("fs");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("slack", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "slack");
        const xliffPath = path.resolve(projectPath, "sample-slack-json-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            if (fs.existsSync(xliffPath)) {
                fs.unlinkSync(xliffPath);
            }
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});

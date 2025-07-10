import path from "node:path";
import { fileURLToPath } from "node:url";
import { LintRunner } from "@ilib-mono/e2e-test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// TODO: fix linter "Could not load plugin python-gnu" error in CI
describe.skip("samples", () => {
    describe("lint", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "lint");
        let stdout;

        beforeAll(async () => {
            const lint = new LintRunner(projectPath);
            const result = await lint.run(".");
            stdout = result.stdout;
        });

        it("should log a linted issue", () => {
            expect(stdout).toContain(
                "The number of XML <b> elements in the target (0) does not match the number in the source (1)."
            );
        });
    });
});

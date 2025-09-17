/*
 * samples.e2e.test.js - E2E tests for ilib-lint samples
 *
 * Copyright © 2025, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { LintRunner } from "ilib-common-config";

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

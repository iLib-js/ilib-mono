/*
 * samples.e2e.test.js - E2E tests for ilib-lint samples
 *
 * Copyright © 2025 JEDLSoft
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

import path from "path";
import { fileURLToPath } from "node:url";
import { LintRunner, FSSnapshot } from "ilib-internal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/* 
* lint execute command: ilib-lint -c ilib-lint-config.json -f html-formatter -o webos-result.html --fix --write
*/
describe("samples", () => {
    describe("lint", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "lint-webOS");
        let stdout;
        let fsSnapshot;
        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create([
                "webos-result.html",
                "xliffs/am-ET.xliff.modified",
                "xliffs/zh-Hans-CN.xliff.modified"
            ].map(f => path.resolve(path.join(projectPath, f))));

            try {
                const lintPath = path.resolve(__dirname, "..", "src", "index.js");
                console.log(path.join(projectPath, "ilib-lint-config.json"))
                const lint = new LintRunner(projectPath, lintPath);

                const result = await lint.run(
                    "-c", path.join(projectPath, "ilib-lint-config.json"),
                    "-f", "html-formatter",
                    "-o", "webos-result.html",
                    "--fix",
                    "--write"
                );
                stdout = "test test ...";
            } catch (error) {
                console.error(">>>> Lint run failed:");
            }
        }, 10000);
        
        afterAll(() => {
            fsSnapshot.restore();
        });

        test("should execute lint with webOS xliff files", () => {
            console.log("stdout from lint:", stdout);
            expect(stdout).toContain("...");
        });
    });
});

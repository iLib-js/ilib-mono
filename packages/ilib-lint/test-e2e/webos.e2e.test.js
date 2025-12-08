/*
 * webos.e2e.test.js - E2E tests for ilib-lint webOS sample
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
import { LintRunner, FSSnapshot, expectFileToMatchSnapshot } from "ilib-internal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("samples", () => {
    describe("lint", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "lint-webOS");
        const modifiedxliffPath = path.resolve(projectPath, "xliffs/am-ET.xliff.modified");
        const modifiedxliffPath2 = path.resolve(projectPath, "xliffs/zh-Hans-CN.xliff.modified");
        const modifiedxliffPath3 = path.resolve(projectPath, "xliffs/en-US.xliff.modified");

        let fsSnapshot;
        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create([
                "webos-result.html",
                "xliffs/am-ET.xliff.modified",
                "xliffs/zh-Hans-CN.xliff.modified",
                "xliffs/en-US.xliff.modified"
            ].map(f => path.resolve(path.join(projectPath, f))));

            try {
                const lintPath = path.resolve(__dirname, "..", "src", "index.js");
                const lint = new LintRunner(projectPath, lintPath);
                await lint.run(
                    "-c", path.join(projectPath, "ilib-lint-config.json"),
                    "-f", "html-formatter",
                    "-o", "webos-result.html",
                    "--fix",
                    "--write"
                );
            } catch (error) {
                console.error(">>>> Lint run failed:");
            }
        }, 10000);
        
        afterAll(() => {
            fsSnapshot.restore();
        });

        test("should generate the modified file (am-ET)", () => {
            expectFileToMatchSnapshot(modifiedxliffPath);
        });
        test("should generate the modified file (zh-Hans-CN)", () => {
            expectFileToMatchSnapshot(modifiedxliffPath2);
        });
        test("should generate the modified file (en-US)", () => {
            expectFileToMatchSnapshot(modifiedxliffPath3);
        });
    });
});

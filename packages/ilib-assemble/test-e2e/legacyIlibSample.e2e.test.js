/*
 * legacyIlibSample.e2e.test.js - E2E test for the legacy-ilib-sample
 *
 * Copyright © 2026 JEDLSoft
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
import { execFileSync } from "child_process";
import { FSSnapshot, expectFileToMatchSnapshot } from "ilib-internal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("samples", () => {
    describe("legacy-ilib-sample", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "legacy-ilib-sample");
        const localeDir = path.join(projectPath, "locale");

        let fsSnapshot;
        beforeAll(() => {
            fsSnapshot = FSSnapshot.create([localeDir]);
            execFileSync("pnpm", ["run", "assemble"], { cwd: projectPath, stdio: "pipe" });
        }, 30000);

        afterAll(() => {
            fsSnapshot.restore();
        });

        test("assembles the en locale data", () => {
            expectFileToMatchSnapshot(path.join(localeDir, "en.js"));
        });

        test("assembles the de locale data", () => {
            expectFileToMatchSnapshot(path.join(localeDir, "de.js"));
        });
    });
});

/*
 * simple.e2e.test.ts - Simple E2E tests for ilib-scriptinfo package loading
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from "path";
import { spawnSync } from "child_process";

const testRootDir = path.resolve(__dirname);
const fixturesDir = path.resolve(testRootDir, "__testfiles__");

/**
 * Test suite for simple package loading
 */
describe("ilib-scriptinfo simple package loading", () => {
    test("ESM module loading works", async () => {
        const testDir = path.resolve(fixturesDir, "esm-test");
        const result = spawnSync("node", ["index.js"], { cwd: testDir, encoding: "utf8" });
        expect(result.status).toBe(0);
        expect(result.error).toBeUndefined();
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 10000);

    test("CommonJS module loading works", async () => {
        const testDir = path.resolve(fixturesDir, "legacy-test");
        const result = spawnSync("node", ["index.js"], { cwd: testDir, encoding: "utf8" });
        expect(result.status).toBe(0);
        expect(result.error).toBeUndefined();
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 10000);

    test("TypeScript module loading works", async () => {
        const testDir = path.resolve(fixturesDir, "typescript-test");
        const result = spawnSync("tsx", ["index.ts"], { cwd: testDir, encoding: "utf8" });
        expect(result.status).toBe(0);
        expect(result.error).toBeUndefined();
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 15000);
});

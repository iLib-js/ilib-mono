/*
 * sample-app.e2e.test.ts - E2E tests for ilib-scriptinfo sample app
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

import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execFileAsync = promisify(execFile);

interface TestResult {
    stdout: string;
    stderr: string;
    code: number;
}

/**
 * Helper function to run the sample app with given arguments
 */
async function runSampleApp(args: string[] = []): Promise<TestResult> {
    const sampleAppPath = path.resolve(__dirname, "..", "samples", "app", "index.js");
    
    try {
        const { stdout, stderr } = await execFileAsync("node", [sampleAppPath, ...args], {
            cwd: path.resolve(__dirname, "..", "samples", "app"),
            env: { ...process.env, NODE_ENV: "test" }
        });
        return { stdout, stderr, code: 0 };
    } catch (error: any) {
        return { 
            stdout: error.stdout || "", 
            stderr: error.stderr || "", 
            code: error.code || 1 
        };
    }
}

describe("ilib-scriptinfo sample app", () => {
    describe("help functionality", () => {
        it("should show help when no arguments provided", async () => {
            const result = await runSampleApp();
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should show help when --help flag is provided", async () => {
            const result = await runSampleApp(["--help"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });
    });

    describe("valid script codes", () => {
        it("should display Latin script information correctly", async () => {
            const result = await runSampleApp(["Latn"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should display Arabic script information correctly", async () => {
            const result = await runSampleApp(["Arab"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should display Han script information correctly", async () => {
            const result = await runSampleApp(["Hani"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });
    });

    describe("case correction functionality", () => {
        it("should correct lowercase input to proper case", async () => {
            const result = await runSampleApp(["latn"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should correct uppercase input to proper case", async () => {
            const result = await runSampleApp(["LATN"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });
    });

    describe("partial matching functionality", () => {
        it("should find partial matches for 'lat'", async () => {
            const result = await runSampleApp(["lat"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should find partial matches for 'arab'", async () => {
            const result = await runSampleApp(["arab"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should find partial matches for 'han'", async () => {
            const result = await runSampleApp(["han"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });
    });

    describe("error handling", () => {
        it("should handle unknown script code with no matches", async () => {
            const result = await runSampleApp(["xyz"]);
            expect(result.code).toBe(0);
            expect(result.stdout).toMatchSnapshot();
            expect(result.stderr).toBe("");
        });

        it("should show error for too many arguments", async () => {
            const result = await runSampleApp(["Latn", "Arab"]);
            expect(result.code).toBe(1);
            expect(result.stdout).toBe("");
            expect(result.stderr).toMatchSnapshot();
        });
    });
}); 
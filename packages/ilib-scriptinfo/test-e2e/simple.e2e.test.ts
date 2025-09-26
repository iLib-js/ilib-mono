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
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface TestResult {
    stdout: string;
    stderr: string;
    code: number;
}

/**
 * Helper function to run simple test scripts
 */
async function runSimpleTest(testDir: string): Promise<TestResult> {
    const testPath = path.resolve(__dirname, testDir);
    
    let command: string = "pnpm"
    let commandArgs: string[] = ["--silent", "start"]

    try {
        const { stdout, stderr } = await execFileAsync(command, commandArgs, {
            cwd: testPath,
            env: { ...process.env, NODE_ENV: "node" }
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

/**
 * Test suite for simple package loading
 */
describe("ilib-scriptinfo simple package loading", () => {
    
    test("ESM module loading works", async () => {
        const result = await runSimpleTest("esm-test");
        expect(result.code).toBe(0);
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 10000);
    
    test("CommonJS module loading works", async () => {
        const result = await runSimpleTest("legacy-test");
        expect(result.code).toBe(0);
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 10000);
    
    test("TypeScript module loading works", async () => {
        const result = await runSimpleTest("typescript-test");
        expect(result.code).toBe(0);
        expect(result.stdout).toMatchSnapshot();
        expect(result.stderr).toBe("");
    }, 15000);
    
});

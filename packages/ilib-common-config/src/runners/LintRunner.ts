/*
 * LintRunner.ts - E2E test runner for ilib-lint
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

import { execFile } from "child_process";

export class LintRunner {
    constructor(private readonly cwd: string, private readonly lintPath: string = "node_modules/.bin/ilib-lint") {}

    run(...args: string[]): Promise<{ stdout: string; stderr: string; code: number | null }> {
        return new Promise((resolve, reject) => {
            execFile(this.lintPath, args, { cwd: this.cwd }, (error, stdout, stderr) => {
                if (error && !error.message.startsWith("Command failed")) {
                    reject(error);
                }
                resolve({
                    stdout,
                    stderr,
                    code: error?.code ?? null,
                });
            });
        });
    }
}

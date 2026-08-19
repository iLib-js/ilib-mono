/*
 * sample-cli.e2e.test.ts - end-to-end tests for the mojito-sdk sample CLI
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import packageMetadata from "../package.json";
import { OPENAPI_SPEC_VERSION } from "../src/lowlevel/spec-meta";

const repositoryRoot = path.resolve(__dirname, "../../..");

describe("mojito-sdk sample CLI", () => {
    test("prints the SDK and OpenAPI versions", () => {
        const result = spawnSync(
            "pnpm",
            ["--filter", "mojito-sdk-cli-sample", "run:sample", "--", "version"],
            {
                cwd: repositoryRoot,
                encoding: "utf8",
            },
        );

        expect(result.error).toBeUndefined();
        expect(result.status).toBe(0);
        expect(result.stdout).toContain(`sdk=${packageMetadata.version}`);
        expect(result.stdout).toContain(`openapi=${OPENAPI_SPEC_VERSION}`);
        expect(result.stderr).toBe("");
    });
});

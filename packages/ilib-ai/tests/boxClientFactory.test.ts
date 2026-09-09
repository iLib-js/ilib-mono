/*
 * boxClientFactory.test.ts
 *
 * Copyright © 2026, JEDLSoft
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

/*
 * Scenario summary — ${VAR} env placeholders for Box credentials (no live Box).
 *
 *   - Plain strings pass through; set env vars are substituted.
 *   - Unset or empty ${VAR} throws and names README.md (do not treat as a token).
 *   - tryResolveEnv returns undefined for unset placeholders (isConfigured check).
 *   - Unresolved accessToken → isBoxInitConfigured false.
 *   - assertBoxInitConfigured throws README hint for unset placeholder or no creds.
 *   - createBoxClientFromInit with unset ${VAR} rejects (does not send "${VAR}").
 */

import {
    assertBoxInitConfigured,
    createBoxClientFromInit,
    isBoxInitConfigured,
    resolveEnv,
    tryResolveEnv,
} from "../src/boxClientFactory";

const UNSET_VAR = "ILIB_AI_TEST_UNSET_ENV_VAR_DO_NOT_SET";

describe("boxClientFactory env placeholders", () => {
    const original = process.env[UNSET_VAR];

    afterEach(() => {
        if (original === undefined) {
            delete process.env[UNSET_VAR];
        } else {
            process.env[UNSET_VAR] = original;
        }
    });

    test("resolveEnv returns a plain string unchanged", () => {
        expect(resolveEnv("token-value")).toBe("token-value");
    });

    test("resolveEnv substitutes a set environment variable", () => {
        process.env[UNSET_VAR] = "from-env";
        expect(resolveEnv(`\${${UNSET_VAR}}`)).toBe("from-env");
    });

    test("resolveEnv throws and mentions README when the variable is unset", () => {
        delete process.env[UNSET_VAR];
        expect(() => resolveEnv(`\${${UNSET_VAR}}`)).toThrow(/README\.md/);
        expect(() => resolveEnv(`\${${UNSET_VAR}}`)).toThrow(UNSET_VAR);
    });

    test("resolveEnv throws when the variable is empty", () => {
        process.env[UNSET_VAR] = "";
        expect(() => resolveEnv(`\${${UNSET_VAR}}`)).toThrow(/README\.md/);
    });

    test("tryResolveEnv returns undefined for an unset placeholder", () => {
        delete process.env[UNSET_VAR];
        expect(tryResolveEnv(`\${${UNSET_VAR}}`)).toBeUndefined();
    });

    test("isBoxInitConfigured is false for an unresolved accessToken placeholder", () => {
        delete process.env[UNSET_VAR];
        expect(
            isBoxInitConfigured({ accessToken: `\${${UNSET_VAR}}` })
        ).toBe(false);
    });

    test("assertBoxInitConfigured throws a README hint for an unresolved placeholder", () => {
        delete process.env[UNSET_VAR];
        expect(() =>
            assertBoxInitConfigured({ accessToken: `\${${UNSET_VAR}}` })
        ).toThrow(/README\.md/);
    });

    test("createBoxClientFromInit does not treat ${VAR} as a literal token", async () => {
        delete process.env[UNSET_VAR];
        await expect(
            createBoxClientFromInit({ accessToken: `\${${UNSET_VAR}}` })
        ).rejects.toThrow(/README\.md/);
    });

    test("assertBoxInitConfigured mentions README when no credentials are given", () => {
        expect(() => assertBoxInitConfigured({})).toThrow(/README\.md/);
    });
});

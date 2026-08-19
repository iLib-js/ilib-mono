/*
 * version.test.ts - tests for mojito-sdk version information
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

import { getApiInfo, getOpenApiSpecVersion, getSdkVersion } from "../src";
import packageMetadata from "../package.json";
import { OPENAPI_SPEC_HASH, OPENAPI_SPEC_VERSION } from "../src/lowlevel/spec-meta";

describe("version helpers", () => {
    test("getSdkVersion returns the package version", () => {
        expect(getSdkVersion()).toBe(packageMetadata.version);
    });

    test("getOpenApiSpecVersion returns the cached OpenAPI info.version", () => {
        expect(getOpenApiSpecVersion()).toBe(OPENAPI_SPEC_VERSION);
        expect(getOpenApiSpecVersion()).toBe("v0");
    });

    test("getApiInfo returns generation metadata", async () => {
        const info = await getApiInfo();
        expect(info.sdkVersion).toBe(packageMetadata.version);
        expect(info.openApiSpecVersion).toBe("v0");
        expect(info.openApiSpecHash).toBe(OPENAPI_SPEC_HASH);
        expect(info.generatedAt).toBeTruthy();
    });
});

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

import {
    getApiInfo,
    getCompatibleMojitoRange,
    getMojitoVersion,
    getOpenApiSpecVersion,
    getSdkVersion,
    isCompatibleMojitoVersion,
} from "../src";
import packageMetadata from "../package.json";
import { OPENAPI_SPEC_HASH, OPENAPI_SPEC_VERSION } from "../src/lowlevel/spec-meta";
import { satisfiesMojitoCaret } from "../src/version";

describe("version helpers", () => {
    test("getSdkVersion returns the package version", () => {
        expect(getSdkVersion()).toBe(packageMetadata.version);
    });

    test("getMojitoVersion reads OpenAPI info.version", () => {
        expect(getMojitoVersion()).toBe(OPENAPI_SPEC_VERSION);
        expect(getMojitoVersion()).toBe("v0");
        expect(getOpenApiSpecVersion()).toBe(getMojitoVersion());
    });

    test("getCompatibleMojitoRange is the npm caret of the Mojito version", () => {
        expect(getCompatibleMojitoRange()).toBe("^0.0.0");
    });

    test("isCompatibleMojitoVersion accepts the version this SDK was built for", () => {
        expect(isCompatibleMojitoVersion("v0")).toBe(true);
        expect(isCompatibleMojitoVersion("0.0.0")).toBe(true);
        expect(isCompatibleMojitoVersion("0.0.1")).toBe(false);
    });

    test("getApiInfo includes Mojito version and caret range", async () => {
        const info = await getApiInfo();
        expect(info.sdkVersion).toBe(packageMetadata.version);
        expect(info.mojitoVersion).toBe("v0");
        expect(info.compatibleMojitoRange).toBe("^0.0.0");
        expect(info.openApiSpecVersion).toBe("v0");
        expect(info.openApiSpecHash).toBe(OPENAPI_SPEC_HASH);
        expect(info.generatedAt).toBeTruthy();
    });
});

describe("satisfiesMojitoCaret", () => {
    test("matches npm caret for 3.4.5: >=3.4.5 <4.0.0", () => {
        expect(satisfiesMojitoCaret("3.4.5", "3.4.5")).toBe(true);
        expect(satisfiesMojitoCaret("3.4.5", "3.4.6")).toBe(true);
        expect(satisfiesMojitoCaret("3.4.5", "3.9.0")).toBe(true);
        expect(satisfiesMojitoCaret("3.4.5", "3.4.4")).toBe(false);
        expect(satisfiesMojitoCaret("3.4.5", "4.0.0")).toBe(false);
        expect(satisfiesMojitoCaret("3.4.5", "2.9.9")).toBe(false);
    });

    test("matches npm caret for 0.x: >=0.2.3 <0.3.0", () => {
        expect(satisfiesMojitoCaret("0.2.3", "0.2.3")).toBe(true);
        expect(satisfiesMojitoCaret("0.2.3", "0.2.9")).toBe(true);
        expect(satisfiesMojitoCaret("0.2.3", "0.3.0")).toBe(false);
        expect(satisfiesMojitoCaret("0.2.3", "1.0.0")).toBe(false);
    });
});

/*
 * index.test.ts - tests for the loctool 3 public API
 *
 * Copyright © 2026 HealthTap, Inc. and JEDLSoft
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

import { getVersion, getVersionBanner } from "../src/index";

describe("loctool", () => {
    test("getVersion returns the package version", () => {
        expect(getVersion()).toBe("3.0.0");
    });

    test("getVersionBanner includes the tool name and version", () => {
        expect(getVersionBanner()).toBe("loctool v3.0.0");
    });
});

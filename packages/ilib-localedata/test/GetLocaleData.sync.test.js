/*
 * GetLocaleData.sync.test.js - test the locale data factory method (sync tests)
 *
 * These tests are Node-only because they require synchronous loading
 * which is not supported by the browser WebpackLoader.
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import { setPlatform } from "ilib-env";

import getLocaleData, { clearLocaleData } from '../src/index.js';

describe("GetLocaleData Sync Tests (Node Only)", () => {
    test("should get locale data with sync", () => {
        expect.assertions(2);

        setPlatform("nodejs");
        clearLocaleData();

        const locData = getLocaleData({
            path: "./test/testfiles/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        expect(locData.isSync()).toBe(true);

        setPlatform(undefined);
    });
});


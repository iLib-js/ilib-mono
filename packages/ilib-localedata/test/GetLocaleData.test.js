/*
 * GetLocaleData.test.js - test the locale data factory method
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

import { getPlatform, setPlatform, clearCache } from "ilib-env";

import MockLoader from './MockLoader.js';
import getLocaleData, { clearLocaleData } from '../src/index.js';

describe("GetLocaleData", () => {
    test("should get locale data", () => {
        expect.assertions(1);
        const locData = getLocaleData({
            path: "./test/files"
        });
        expect(locData).toBeTruthy();
    });

    test("should throw error when get locale data called without path", () => {
        expect.assertions(1);
        expect(() => {
            getLocaleData({
                name: "test"
            });
        }).toThrow();
    });

    test("should throw error when get locale data called without options", () => {
        expect.assertions(1);
        expect(() => {
            getLocaleData();
        }).toThrow();
    });

    test("should throw error when get locale data called with empty path", () => {
        expect.assertions(1);
        expect(() => {
            getLocaleData({
                path: "",
                name: "test"
            });
        }).toThrow();
    });

    test("should throw error when get locale data called with null path", () => {
        expect.assertions(1);
        expect(() => {
            getLocaleData({
                path: null,
                name: "test"
            });
        }).toThrow();
    });

    test("should get locale data without sync", () => {
        expect.assertions(1);

        clearLocaleData();

        const locData = getLocaleData({
            path: "./test/files",
        });

        expect(!locData.isSync()).toBe(true);
    });

    test("should get locale data with sync", () => {
        expect.assertions(2);

        setPlatform("nodejs");
        clearLocaleData();

        const locData = getLocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        expect(locData.isSync()).toBe(true);

        setPlatform(undefined);
    });

    test("should return singleton locale data", () => {
        expect.assertions(3);
        clearLocaleData();

        const locData1 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData1).toBeTruthy();

        // same params means same instance
        const locData2 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData2).toBeTruthy();

        expect(locData1).toBe(locData2);
    });

    test("should return different instances for different paths", () => {
        expect.assertions(5);
        clearLocaleData();

        const locData1 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData1).toBeTruthy();

        // different params means different instance
        const locData2 = getLocaleData({
            path: "./test/files2",
            sync: false
        });
        expect(locData2).toBeTruthy();

        expect(locData1.getPath()).toBe("./test/files");
        expect(locData2.getPath()).toBe("./test/files2");
        expect(locData1).not.toBe(locData2);
    });
}); 
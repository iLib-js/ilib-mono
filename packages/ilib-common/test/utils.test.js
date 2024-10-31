/*
 * utils.test.js - test the utility routines
 *
 * Copyright © 2012-2015, 2017-2019, 2023 2021- 2022-2023JEDLSoft
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

import * as ilibEnv from 'ilib-env';
import Locale from 'ilib-locale';
import semver from 'semver';

import * as Utils from '../src/Utils.js';
import * as JSUtils from '../src/JSUtils.js';
import ISet from '../src/ISet.js';

let set = new ISet();

describe("testUtils", () => {
    test("MergeSimple", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        let expected = {"a": "A", "b": "B", "c": "C", "d": "D"};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSimpleNoSideEffects", () => {
        expect.assertions(2);
        let object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        let x = JSUtils.merge(object1, object2);

        expect(typeof(x) !== "undefined").toBeTruthy();
        let expected = {"a": "A", "b": "B"};
        expect(object1).toEqual(expected);
    });

    test("MergeArrays", () => {
        expect.assertions(1);
        let object1 = {"a": ["b", "c"]},
            object2 = {"a": ["d"]};

        let expected = {"a": ["b", "c", "d"]};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeArraysDups", () => {
        expect.assertions(1);
        let object1 = {"a": ["b", "c"]},
            object2 = {"a": ["c", "d"]};

        let expected = {"a": ["b", "c", "c", "d"]};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeArraysEmptySource", () => {
        expect.assertions(1);
        let object1 = {"a": []},
            object2 = {"a": ["d"]};

        let expected = {"a": ["d"]};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeArraysEmptyTarget", () => {
        expect.assertions(1);
        let object1 = {"a": ["b", "c"]},
            object2 = {"a": []};

        let expected = {"a": ["b", "c"]};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeArraysIncongruentTypes1", () => {
        expect.assertions(1);
        let object1 = {"a": ["b", "c"]},
            object2 = {"a": "d"};

        let expected = {"a": "d"};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeArraysIncongruentTypes2", () => {
        expect.assertions(1);
        let object1 = {"a": "b"},
            object2 = {"a": ["d"]};

        let expected = {"a": ["d"]};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSimpleProperty", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": "B"},
            object2 = {"b": "X"};

        let expected = {"a": "A", "b": "X"};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeComplexProperty", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": {"x": "B"}},
            object2 = {"b": "X"};

        let expected = {"a": "A", "b": "X"};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSubobjects", () => {
        expect.assertions(1);
        let object1 = {"b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        let expected = {"b": {"x": "M", "y": "N"}};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSubobjectsLeaveObj1PropsUntouched", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": {"x": "X", "y": "Y", "z": "Z"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        let expected = {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSubobjectsAddProps", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        let expected = {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeSubobjectsAddProps", () => {
        expect.assertions(1);
        let object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        let expected = {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeBooleans", () => {
        expect.assertions(1);
        let object1 = {"a": true, "b": true},
            object2 = {"b": false};

        let expected = {"a": true, "b": false};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeAddBooleans", () => {
        expect.assertions(1);
        let object1 = {"a": true, "b": true},
            object2 = {"c": false};

        let expected = {"a": true, "b": true, "c": false};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeNumbers", () => {
        expect.assertions(1);
        let object1 = {"a": 1, "b": 2},
            object2 = {"b": 3};

        let expected = {"a": 1, "b": 3};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeNumbersWithZero", () => {
        expect.assertions(1);
        let object1 = {"a": 1, "b": 2},
            object2 = {"b": 0};

        let expected = {"a": 1, "b": 0};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeNumbersAddZero", () => {
        expect.assertions(1);
        let object1 = {"a": 1, "b": 2},
            object2 = {"c": 0};

        let expected = {"a": 1, "b": 2, "c": 0};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeUndefined", () => {
        expect.assertions(1);
        let object1 = undefined,
            object2 = {"a": 1, "b": 2};

        let expected = {"a": 1, "b": 2};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("MergeUndefined2", () => {
        expect.assertions(1);
        let object1 = {"a": 1, "b": 2},
            object2 = undefined;

        let expected = {"a": 1, "b": 2};
        let actual = JSUtils.merge(object1, object2);
        expect(actual).toEqual(expected);
    });

    test("IsEmptyFalse", () => {
        expect.assertions(1);
        let object = {"a": "A"};

        expect(!JSUtils.isEmpty(object)).toBeTruthy();
    });

    test("IsEmptyTrue", () => {
        expect.assertions(1);
        let object = {};

        expect(JSUtils.isEmpty(object)).toBeTruthy();
    });

    test("IsEmptyUndefined", () => {
        expect.assertions(1);
        expect(JSUtils.isEmpty(undefined)).toBeTruthy();
    });

    test("IsEmptyUndefinedProperties", () => {
        expect.assertions(1);
        let object = {"a": undefined};

        expect(JSUtils.isEmpty(object)).toBeTruthy();
    });

    test("IsEmptyFalsyValues", () => {
        expect.assertions(1);
        let object = {"a": false, "b": 0};

        expect(!JSUtils.isEmpty(object)).toBeTruthy();
    });

    test("ShallowCopy", () => {
        expect.assertions(2);
        let src = {"a": "b"};
        let tgt = {};

        expect(typeof(tgt.a) === "undefined").toBeTruthy();

        JSUtils.shallowCopy(src, tgt);

        expect(typeof(tgt.a) !== "undefined").toBeTruthy();
    });

    test("ShallowCopyRightValues", () => {
        expect.assertions(4);
        let src = {
            "a": "b",
            "c": {
                "d": "e",
                "f": 23
            }
        };
        let tgt = {};

        expect(typeof(tgt.a) === "undefined").toBeTruthy();

        JSUtils.shallowCopy(src, tgt);

        expect(tgt.a).toBe("b");
        expect(tgt.c.d).toBe("e");
        expect(tgt.c.f).toBe(23);
    });

    test("ShallowCopyUndefined", () => {
        expect.assertions(4);
        let src = undefined;
        let tgt = {};

        expect(typeof(tgt) !== "undefined").toBeTruthy();
        expect(JSUtils.isEmpty(tgt)).toBeTruthy();

        JSUtils.shallowCopy(src, tgt);

        expect(typeof(tgt) !== "undefined").toBeTruthy();
        expect(JSUtils.isEmpty(tgt)).toBeTruthy();
    });

    test("ShallowCopyToUndefined", () => {
        let src = {
            "a": "b",
            "c": {
                "d": "e",
                "f": 23
            }
        };
        let tgt = undefined;

        expect(typeof(tgt) === "undefined").toBeTruthy();

        try {
            JSUtils.shallowCopy(src, tgt);
            expect(typeof(tgt) === "undefined").toBeTruthy();
        } catch (e) {
            test.fail();
        }
    });

    test("ShallowCopyEmpty", () => {
        expect.assertions(2);
        let src = {};
        let tgt = {};

        expect(JSUtils.isEmpty(tgt)).toBeTruthy();
        JSUtils.shallowCopy(src, tgt);
        expect(JSUtils.isEmpty(tgt)).toBeTruthy();
    });

    test("ShallowCopyEmptyValues", () => {
        expect.assertions(4);
        let src = {
            "a": 0,
            "b": "",
            "c": null,
            "d": undefined
        };
        let tgt = {};

        JSUtils.shallowCopy(src, tgt);

        expect(tgt.a).toBe(0);
        expect(tgt.b).toBe("");
        expect(tgt.c).toBe(null);
        expect(tgt.d).toBe(undefined);
    });

    test("GetSublocalesENUS", () => {
        expect.assertions(1);

        expect(Utils.getSublocales("en-US")).toEqual(["root", "en", "und-US", "en-US"]);
    });

    test("GetSublocalesESUS", () => {
        expect.assertions(1);

        expect(Utils.getSublocales("es-US")).toEqual(["root", "es", "und-US","es-US"]);
    });

    test("GetSublocalesZHCN", () => {
        expect.assertions(1);

        expect(Utils.getSublocales("zh-Hans-CN")).toEqual(["root", "zh", "und-CN", "zh-Hans", "zh-CN", "zh-Hans-CN"]);
    });

    test("GetSublocalesWithVariant", () => {
        expect.assertions(1);

        expect(Utils.getSublocales("es-US-ASDF")).toEqual([
            "root",
            "es",
            "und-US",
            "es-US",
            "es-ASDF",
            "und-US-ASDF",
            "es-US-ASDF"
        ]);
    });

    test("GetSublocalesWithScriptAndVariant", () => {
        expect.assertions(1);

        expect(Utils.getSublocales("zh-Hans-CN-ASDF")).toEqual([
            "root",
            "zh",
            "und-CN",
            "zh-Hans",
            "zh-CN",
            "zh-ASDF",
            "und-CN-ASDF",
            "zh-Hans-CN",
            "zh-Hans-ASDF",
            "zh-CN-ASDF",
            "zh-Hans-CN-ASDF"
        ]);
    });

/*
    test("MergeLocData", () => {
        expect.assertions(3);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("de-DE-Latn-SAP");
        let m = Utils.mergeLocData("foobar", locale);
        expect(m.a).toBe("e");
        expect(m.c).toBe("f");
        expect(m.g).toBe("i");

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataNoLocale", () => {
        expect.assertions(3);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("-");
        let m = Utils.mergeLocData("foobar", locale);
        expect(m.a).toBe("b");
        expect(m.c).toBe("d");
        expect(typeof(m.g) === "undefined").toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataNonLeafLocale", () => {
        expect.assertions(3);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("de-DE");
        let m = Utils.mergeLocData("foobar", locale);
        expect(m.a).toBe("e");
        expect(m.c).toBe("f");
        expect(typeof(m.g) === "undefined").toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataMissingData", () => {
        expect.assertions(1);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
           g: "i"
        };

        let locale = new Locale("de-DE-Latn-SAP");
        let m = Utils.mergeLocData("asdf", locale);
        expect(m).toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataNoName", () => {
        expect.assertions(1);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("de-DE-Latn-SAP");
        let m = Utils.mergeLocData(undefined, locale);
        expect(m).toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataNoLocale", () => {
        expect.assertions(4);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_en = {
            a: "e"
        };
        ilib.data.foobar_en_US = {
            c: "f"
        };
        ilib.data.foobar_en_Latn_US = {
            g: "h"
        };
        ilib.data.foobar_en_Latn_US_SAP = {
            g: "i"
        };

        let m = Utils.mergeLocData("foobar"); // use the current locale -- en-US
        expect(typeof(m) !== "undefined").toBeTruthy();

        expect(m.a).toBe("e");
        expect(m.c).toBe("f");
        expect(typeof(m.g) === "undefined").toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_en = ilib.data.foobar_en_US = ilib.data.foobar_en_Latn_US = ilib.data.foobar_en_Latn_US_SAP = undefined;
    });

    test("MergeLocDataNoSideEffects", () => {
        expect.assertions(4);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_DE = {
            c: "f"
        };
        ilib.data.foobar_de_Latn_DE = {
            g: "h"
        };
        ilib.data.foobar_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("de-DE-Latn-SAP");
        let m = Utils.mergeLocData("foobar", locale);
        expect(typeof(m) !== "undefined").toBeTruthy();
        expect(ilib.data.foobar.a).toBe("b");
        expect(ilib.data.foobar.c).toBe("d");
        expect(typeof(ilib.data.foobar.g) === "undefined").toBeTruthy();

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_DE = ilib.data.foobar_de_Latn_DE = ilib.data.foobar_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataNoBase", () => {
        expect.assertions(3);
        ilib.data.asdf_de = {
            a: "e"
        };
        ilib.data.asdf_de_DE = {
            c: "f"
        };
        ilib.data.asdf_de_Latn_DE = {
            g: "h"
        };
        ilib.data.asdf_de_Latn_DE_SAP = {
            g: "i"
        };

        let locale = new Locale("de-DE-Latn-SAP");
        let m = Utils.mergeLocData("asdf", locale);
        expect(m.a).toBe("e");
        expect(m.c).toBe("f");
        expect(m.g).toBe("i");

        // clean up for the other tests
        ilib.data.asdf_de = ilib.data.asdf_de_DE = ilib.data.asdf_de_Latn_DE = ilib.data.asdf_de_Latn_DE_SAP = undefined;
    });

    test("MergeLocDataMissingLocaleParts", () => {
        expect.assertions(3);
        ilib.data.foobar = {
            a: "b",
            c: "d"
        };
        ilib.data.foobar_de = {
            a: "e"
        };
        ilib.data.foobar_de_Latn = {
            g: "i"
        };

        let locale = new Locale("de-Latn");
        let m = Utils.mergeLocData("foobar", locale);
        expect(m.a).toBe("e");
        expect(m.c).toBe("d");
        expect(m.g).toBe("i");

        // clean up for the other tests
        ilib.data.foobar = ilib.data.foobar_de = ilib.data.foobar_de_Latn = undefined;
    });
*/

    test("GetLocFilesLanguageOnly", () => {
        expect.assertions(2);
        let locale = new Locale("en");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesRegionOnly", () => {
        expect.assertions(2);
        let locale = new Locale("US");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "und/US/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangScript", () => {
        expect.assertions(2);
        let locale = new Locale("en-Latn");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "en/Latn/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangRegion", () => {
        expect.assertions(2);
        let locale = new Locale("en-US");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "und/US/localeinfo.json",
            "en/US/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangVariant", () => {
        expect.assertions(2);
        let locale = new Locale("en-govt");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "en/govt/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesScriptRegion", () => {
        expect.assertions(2);
        let locale = new Locale("Latn-US");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "und/US/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesRegionVariant", () => {
        expect.assertions(2);
        let locale = new Locale("US-GOVT");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "und/US/localeinfo.json",
            "und/US/GOVT/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangScriptRegion", () => {
        expect.assertions(2);
        let locale = new Locale("en-Latn-US");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "und/US/localeinfo.json",
            "en/Latn/localeinfo.json",
            "en/US/localeinfo.json",
            "en/Latn/US/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangScriptVariant", () => {
        expect.assertions(2);
        let locale = new Locale("en-Latn-govt");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "en/Latn/localeinfo.json",
            "en/govt/localeinfo.json",
            "en/Latn/govt/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesLangRegionVariant", () => {
        expect.assertions(2);
        let locale = new Locale("en-US-govt");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "und/US/localeinfo.json",
            "en/US/localeinfo.json",
            "en/govt/localeinfo.json",
            "und/US/govt/localeinfo.json",
            "en/US/govt/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesAll", () => {
        expect.assertions(2);
        let locale = new Locale("en-US-Latn-govt");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "und/US/localeinfo.json",
            "en/Latn/localeinfo.json",
            "en/US/localeinfo.json",
            "en/govt/localeinfo.json",
            "und/US/govt/localeinfo.json",
            "en/Latn/US/localeinfo.json",
            "en/Latn/govt/localeinfo.json",
            "en/US/govt/localeinfo.json",
            "en/Latn/US/govt/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesNoLocale", () => {
        expect.assertions(2);
        let locale = new Locale("-");
        let f = Utils.getLocFiles(locale, "localeinfo.json");
        let expected = [
            "localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesNoBasename", () => {
        expect.assertions(2);
        let locale = new Locale("en-US-Latn-govt");
        let f = Utils.getLocFiles(locale, undefined);
        let expected = [
            "resources.json",
            "en/resources.json",
            "und/US/resources.json",
            "en/Latn/resources.json",
            "en/US/resources.json",
            "en/govt/resources.json",
            "und/US/govt/resources.json",
            "en/Latn/US/resources.json",
            "en/Latn/govt/resources.json",
            "en/US/govt/resources.json",
            "en/Latn/US/govt/resources.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("GetLocFilesDefaultLocale", () => {
        expect.assertions(2);
        let f = Utils.getLocFiles(undefined, "localeinfo.json");
        let expected = [
            "localeinfo.json",
            "en/localeinfo.json",
            "und/US/localeinfo.json",
            "en/US/localeinfo.json"
        ];

        expect(f.length).toBe(expected.length);
        expect(f).toEqual(expected);
    });

    test("HashCodeEmptyString", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode("")).toBe(0);
    });

    test("HashCodeEmptyNumber", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(0)).toBe(48);
    });

    test("HashCodeEmptyObject", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode({})).toBe(0);
    });

    test("HashCodeEmptyBoolean", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(false)).toBe(0);
    });

    test("HashCodeUndefined", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(undefined)).toBe(0);
    });

    test("HashCodeNull", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(null)).toBe(0);
    });

    test("HashCodeFunction", () => {
        expect.assertions(1);
        expect(0 < JSUtils.hashCode(function(asdf) { return asdf * 38; })).toBeTruthy();
    });

    test("HashCodeEqualStrings", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode("abcdef")).toBe(JSUtils.hashCode("abcdef"));
    });

    test("HashCodeNotEqualStrings", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode("abcdef")).not.toBe(JSUtils.hashCode("abcdefg"));
    });

    test("HashCodeEqualNumbers", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(23455)).toBe(JSUtils.hashCode(23455));
    });

    test("HashCodeNotEqualNumbers", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(33455)).not.toBe(JSUtils.hashCode(23455));
    });

    test("HashCodeEqualBoolean", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(true)).toBe(JSUtils.hashCode(true));
    });

    test("HashCodeNotEqualBoolean", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode(true)).not.toBe(JSUtils.hashCode(false));
    });

    test("HashCodeEqualFunction", () => {
        expect.assertions(1);
        let expected = JSUtils.hashCode(function a() { return "a"; });
        expect(JSUtils.hashCode(function a() { return "a"; })).toBe(expected);
    });

    test("HashCodeEqualFunctionDifferentSpacing", () => {
        expect.assertions(1);
        let plat = ilibEnv.getPlatform();
        if (plat === "qt" || plat === "rhino" || plat === "trireme" || plat === "browser") {
            // the qt javascript engine doesn't allow you to see the code of a function, so all
            // functions should have the same hash. On Rhino, you can see the code, but the white
            // space is all normalized nicely to the same thing, so logically equivalent functions
            // that only differ in white space compare the same. (This seems the most logical to
            // me out of all of these!)
            let expected = JSUtils.hashCode(function a () { return "a"; });
            expect(JSUtils.hashCode(function a(){return "a";})).toBe(expected);
        } else {
            let expected = JSUtils.hashCode(Function("function a () { return \"a\"; }"));
            expect(JSUtils.hashCode(Function("function a(){return \"a\";}"))).not.toBe(expected);
        }
    });

    test("HashCodeNotEqualFunctionDifferentNames", () => {
        expect.assertions(1);
        let expected = JSUtils.hashCode(function a() { return "a"; });
        expect(JSUtils.hashCode(function b() { return "a"; })).not.toBe(expected);
    });
    test("HashCodeNotEqualFunctionDifferentContents", () => {
        expect.assertions(1);
        if (ilibEnv.getPlatform() === "qt") {
            // the qt javascript engine doesn't allow you to see the code of a function, so all
            // functions should have the same hash
            let expected = JSUtils.hashCode(function a() { return "a"; });
            expect(JSUtils.hashCode(function a() { return "b"; })).toBe(expected);
        } else {
            let expected = JSUtils.hashCode(function a() { return "a"; });
            expect(JSUtils.hashCode(function a() { return "b"; })).not.toBe(expected);
        }
    });

    test("HashCodeEqualObjects", () => {
        expect.assertions(1);
        let expected = JSUtils.hashCode({name: "abcdef"});
        expect(JSUtils.hashCode({name: "abcdef"})).toBe(expected);
    });

    test("HashCodeNotEqualObjectProperties", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode({value: "abcdef"})).not.toBe(JSUtils.hashCode({name: "abcdef"}));
    });

    test("HashCodeNotEqualObjectOneEmpty", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode({value: "abcdef"})).not.toBe(JSUtils.hashCode({}));
    });

    test("HashCodeNotEqualObjectValues", () => {
        expect.assertions(1);
        expect(JSUtils.hashCode({name: "abcdef"})).not.toBe(JSUtils.hashCode({name: "abcXdef"}));
    });

    test("HashCodeEqualObjectScrambledProperties", () => {
        expect.assertions(1);
        let expected = JSUtils.hashCode({name: "abcdef", num: 3, value: "asdf"});
        expect(JSUtils.hashCode({value: "asdf", name: "abcdef", num: 3})).toBe(expected);
    });

    test("HashCodeNotEqualObjectValuesComplex", () => {
        expect.assertions(1);
        let expected = JSUtils.hashCode({num: 3, apple: "jacks", type: false, name: "abcXdef"});
        expect(JSUtils.hashCode({name: "abcdef", apple: "jacks", num: 3, type: false})).not.toBe(expected);
    });

/*
    test("LoadDataCorrectType", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "en-US",
            type: "json",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(typeof(results) === 'object').toBeTruthy();
            }
        });
    });

    test("LoadDataCorrectItems", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "en-US",
            type: "json",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "b", "c": "m", "e": "y"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataWithLocale", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "de-DE",
            type: "json",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "a1", "c": "de2", "e": "f"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataWithLocaleMissingParts", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "fr-Latn-FR",
            type: "json",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "b", "c": "fr1", "e": "f"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataDefaultLocale", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            type: "json",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "b", "c": "m", "e": "y"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });


    test("LoadDataNonJson", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }

        ilib.clearCache();
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "en-US",
            type: "other",
            loadParams: {},
            sync: true,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"e": "y"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataAsynch", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }

        ilib.clearCache();
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            object: "obj",
            locale: "en-US",
            type: "json",
            loadParams: {},
            sync: false,
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "b", "c": "m", "e": "y"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataDefaults", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.clearCache();
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "b", "c": "m", "e": "y"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataNonJson_en_US", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.clearCache();
        ilib.data.foo = ilib.data.foo_en = ilib.data.foo_und_US = ilib.data.foo_en_US = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            type: "html",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results, "<html><body>This is the generic).toEqual(shared foo.</body></html>");
            }
        });
    });

    test("LoadDataNonJson_de", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            type: "html",
            locale: "de",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results).toEqual("<html><body>Diese ist Foo auf Deutsch.</body></html>");
            }
        });
    });

    test("LoadDataNonJson_de_DE", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            type: "html",
            locale: "de-DE",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results).toEqual("<html><body>Diese ist Foo auf Deutsch fuer Deutschland.</body></html>");
            }
        });
    });

    test("LoadDataNonJson_DE", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            type: "html",
            locale: "DE",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results).toEqual("<html><body>Diese ist Foo fuer Deutschland.</body></html>");
            }
        });
    });

    test("LoadDataNonJsonWithFallbackToLanguage", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_fr = ilib.data.foo_und_FR = ilib.data.foo_fr_FR = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);

        Utils.loadData({
            name: "foo.html",
            type: "html",
            locale: "fr-FR",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results).toEqual("<html><body>Ceci est foo en francais.</body></html>");
            }
        });
    });

    test("LoadDataNonJsonWithFallbackToRoot", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_es = ilib.data.foo_und_ES = ilib.data.foo_es_ES = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            type: "html",
            locale: "es-ES",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results, "<html><body>This is the generic).toEqual(shared foo.</body></html>");
            }
        });
    });

    test("LoadDataNonJsonInferFileTypeFromExtension", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.html",
            locale: "de",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                expect.assertions(1);
                expect(results).toEqual("<html><body>Diese ist Foo auf Deutsch.</body></html>");
            }
        });
    });

    test("LoadDataJsonInferFileTypeFromExtension", () => {
        if (ilib.isDynData()) {
            // don't need to test loading on the dynamic load version because we are testing
            // it via all the other tests already.
            return;
        }
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderUtil);
        Utils.loadData({
            name: "foo.json",
            locale: "de-DE",
            callback: function (results) {
                ilib.setLoaderCallback(oldLoader);
                let expected = {"a": "a1", "c": "de2", "e": "f"};
                expect.assertions(1);
                expect(results).toEqual(expected);
            }
        });
    });

    test("LoadDataCacheResult", () => {
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderNoMulti);
        try {
            expect.assertions(2);
            Utils.loadData({
                name: "foo.json",
                locale: "de-DE",
                callback: function (results) {
                    expect(results).toBeTruthy();
                    Utils.loadData({
                        name: "foo.json",
                        locale: "de-DE",
                        callback: function (results2) {
                            // if there is a cache miss when it attempts to load a file from disk twice
                            // then the mock loader will throw an exception
                            expect(results2).toBeTruthy();
                        }
                    });
                }
            });
        } catch (e) {
            console.log("Exception caught: " + e.stack);
            test.fail(e);
        }
    });

    test("LoadDataDontMixDifferentBasePaths", () => {
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderNoMulti);
        try {
            Utils.loadData({
                name: "foo.json",
                locale: "de-DE",
                basePath: "asdf",
                callback: function (results) {
                    expect(results).toBeTruthy();
                    Utils.loadData({
                        name: "foo.json",
                        locale: "de-DE",
                        basePath: "foobar",
                        callback: function (results2) {
                            // if there is a cache miss when it attempts to load a file from disk twice
                            // then the mock loader will throw an exception, which is expected here
                            // because the base paths are different and Utils.loadData should try to
                            // load two files with the same name but different bases.
                            test.fail();
                        }
                    });
                }
            });
        } catch (e) {
        }
    });

    test("LoadDataCacheResultAlreadyMerged", () => {
        ilib.data.foo = ilib.data.foo_de = ilib.data.foo_und_DE = ilib.data.foo_de_DE = undefined;
        ilib.setLoaderCallback(mockLoaderNoMulti);
        let cacheMerged = ilib._cacheMerged;
        set = new ISet(); // clear the mock loader's cache
        try {
            expect.assertions(2);
            ilib._cacheMerged = true;
            Utils.loadData({
                name: "foo.json",
                locale: "de-DE",
                callback: function (results) {
                    expect(results).toBeTruthy();
                    Utils.loadData({
                        name: "foo.json",
                        locale: "de-DE",
                        callback: function (results2) {
                            // if there is a cache miss when it attempts to load a file from disk twice
                            // then the mock loader will throw an exception
                            expect(results2).toBeTruthy();
                            ilib._cacheMerged = cacheMerged;
                        }
                    });
                }
            });
        } catch (e) {
            console.log("Exception caught: " + e.stack);
            test.fail(e);
        } finally {
            ilib._cacheMerged = cacheMerged;
        }
    });
*/
    test("MapStringDigits", () => {
        expect.assertions(1);
        let map = "abcdefghij".split("");

        expect(JSUtils.mapString("9876543210", map)).toBe("jihgfedcba");
    });

    test("MapStringDigitsUnknown", () => {
        expect.assertions(1);
        let map = "abcde".split("");

        expect(JSUtils.mapString("9876543210", map)).toBe("98765edcba");
    });

    test("MapStringHash", () => {
        expect.assertions(1);
        let map = {
            "a": "x",
            "b": "y",
            "c": "z"
        };

        expect(JSUtils.mapString("abccb", map)).toBe("xyzzy");
    });

    test("MapStringUndefined", () => {
        expect.assertions(1);
        let map = {
            "a": "x",
            "b": "y",
            "c": "z"
        };

        expect(typeof(JSUtils.mapString(undefined, map)) === "undefined").toBeTruthy();
    });

    test("MapStringUndefinedMap", () => {
        expect.assertions(1);
        expect(JSUtils.mapString("abccb", undefined)).toBe("abccb");
    });

    test("MapStringHashUnknown", () => {
        expect.assertions(1);
        let map = {
            "a": "x",
            "b": "y",
            "c": "z"
        };

        expect(JSUtils.mapString("abcdefabc", map)).toBe("xyzdefxyz");
    });

    test("MapStringHashMulti", () => {
        expect.assertions(1);
        let map = {
            "a": "xm",
            "b": "yn",
            "c": "zo"
        };

        expect(JSUtils.mapString("abcabc", map)).toBe("xmynzoxmynzo");
    });

    test("IndexOf", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, "b")).toBe(1);
    });

    test("IndexOfNeg", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, "d")).toBe(-1);
    });

    test("IndexOfBeginning", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, "a")).toBe(0);
    });

    test("IndexOfEnd", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, "c")).toBe(2);
    });

    test("IndexOfCaseSensitive", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, "C")).toBe(-1);
    });

    test("IndexOfWrongObjectType", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, 2)).toBe(-1);
    });

    test("IndexOfUndefinedSearchTerm", () => {
        expect.assertions(1);
        let arr = ["a", "b", "c"];
        expect(JSUtils.indexOf(arr, undefined)).toBe(-1);
    });

    test("IndexOfUndefinedArray", () => {
        expect.assertions(1);
        expect(JSUtils.indexOf(undefined, "a")).toBe(-1);
    });

    test("ToHexStringSimple", () => {
        expect.assertions(1);
        expect(JSUtils.toHexString("a")).toBe("0061");
    });

    test("ToHexStringWithLengthLimit2", () => {
        expect.assertions(1);
        expect(JSUtils.toHexString("a", 2)).toBe("61");
    });

    test("ToHexStringWithLengthLimit8", () => {
        expect.assertions(1);
        expect(JSUtils.toHexString("a", 8)).toBe("00000061");
    });

    test("ToHexStringChinese", () => {
        expect.assertions(1);
        expect(JSUtils.toHexString("㗀")).toBe("35C0");
    });

    test("ToHexStringComplex", () => {
        expect.assertions(1);
        expect(JSUtils.toHexString("a㗀จఓ")).toBe("006135C00E080C13");
    });

    test("Pad2lt10", () => {
        expect.assertions(1);
        expect(JSUtils.pad(1, 2)).toBe("01");
    });

    test("Pad2lt0", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-1, 2)).toBe("-01");
    });

    test("Pad2gt10", () => {
        expect.assertions(1);
        expect(JSUtils.pad(11, 2)).toBe("11");
    });

    test("Pad2ltMinus10", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-11, 2)).toBe("-11");
    });

    test("Pad2gt100", () => {
        expect.assertions(1);
        expect(JSUtils.pad(111, 2)).toBe("111");
    });

    test("Pad2ltMinus100", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-111, 2)).toBe("-111");
    });

    test("Pad0", () => {
        expect.assertions(2);
        expect(JSUtils.pad(1, 0)).toBe("1");
        expect(JSUtils.pad(10, 0)).toBe("10");
    });

    test("Pad0Neg", () => {
        expect.assertions(2);
        expect(JSUtils.pad(-1, 0)).toBe("-1");
        expect(JSUtils.pad(-10, 0)).toBe("-10");
    });

    test("Pad4_1", () => {
        expect.assertions(1);
        expect(JSUtils.pad(6, 4)).toBe("0006");
    });

    test("Pad4_2", () => {
        expect.assertions(1);
        expect(JSUtils.pad(67, 4)).toBe("0067");
    });

    test("Pad4_3", () => {
        expect.assertions(1);
        expect(JSUtils.pad(679, 4)).toBe("0679");
    });

    test("Pad4_4", () => {
        expect.assertions(1);
        expect(JSUtils.pad(6792, 4)).toBe("6792");
    });

    test("Pad4_5", () => {
        expect.assertions(1);
        expect(JSUtils.pad(67925, 4)).toBe("67925");
    });

    test("Pad4_6", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-1, 4)).toBe("-0001");
    });

    test("Pad4_7", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-10, 4)).toBe("-0010");
    });

    test("Pad4_8", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-112, 4)).toBe("-0112");
    });

    test("Pad4_9", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-1123, 4)).toBe("-1123");
    });

    test("Pad4_10", () => {
        expect.assertions(1);
        expect(JSUtils.pad(-11233, 4)).toBe("-11233");
    });

    test("Pad2lt10String", () => {
        expect.assertions(1);
        expect(JSUtils.pad("1", 2)).toBe("01");
    });

    test("Pad2gt10String", () => {
        expect.assertions(1);
        expect(JSUtils.pad("11", 2)).toBe("11");
    });

    test("Pad2gt100String", () => {
        expect.assertions(1);
        expect(JSUtils.pad("111", 2)).toBe("111");
    });

    test("PadRightSide4", () => {
        expect.assertions(1);
        expect(JSUtils.pad("123", 6, true)).toBe("123000");
    });

    test("PadRightSide4Decimal", () => {
        expect.assertions(1);
        expect(JSUtils.pad("1.0", 6, true)).toBe("1.0000");
    });

    test("PadRightSideEnough", () => {
        expect.assertions(1);
        expect(JSUtils.pad("1.234323", 4, true)).toBe("1.234323");
    });
});

/*
 * assemble.test.js - test the assemble utility
 *
 * Copyright © 2022, 2024 JEDLSoft
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

import { JSUtils } from 'ilib-common';

describe("testAssemble", () => {
    test("IsArrayNewArrayObj", () => {
        expect.assertions(1);
        var a = new Array();
        expect(JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayNewArrayBrackets", () => {
        expect.assertions(1);
        var a = [];
        expect(JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayObject", () => {
        expect.assertions(1);
        var a = {foo:234};
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayObjectWithNumericProperties", () => {
        expect.assertions(1);
        var a = {"0": "d", "1": "c"};
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayNumber", () => {
        expect.assertions(1);
        var a = 234;
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayString", () => {
        expect.assertions(1);
        var a = "asdf";
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayNull", () => {
        expect.assertions(1);
        var a = null;
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("IsArrayUndefined", () => {
        expect.assertions(1);
        var a = undefined;
        expect(!JSUtils.isArray(a)).toBeTruthy();
    });

    test("ExtendSimple", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "B", "c": "C", "d": "D"});
    });

    test("ExtendReturnObject1", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        var x = JSUtils.extend(object1, object2);
        expect(x).toBe(object1);
    });

    test("ExtendArrays", () => {
        expect.assertions(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": ["d"]};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c", "d"]});
    });

    test("ExtendArraysDups", () => {
        expect.assertions(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": ["c", "d"]};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c", "c", "d"]});
    });

    test("ExtendArraysEmptySource", () => {
        expect.assertions(1);
        var object1 = {"a": []},
            object2 = {"a": ["d"]};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["d"]});
    });

    test("ExtendArraysEmptyTarget", () => {
        expect.assertions(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": []};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c"]});
    });

    test("ExtendArraysIncongruentTypes1", () => {
        expect.assertions(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": "d"};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "d"});
    });

    test("ExtendArraysIncongruentTypes2", () => {
        expect.assertions(1);
        var object1 = {"a": "b"},
            object2 = {"a": ["d"]};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["d"]});
    });

    test("ExtendSimpleProperty", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"b": "X"};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "X"});
    });

    test("ExtendComplexProperty", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": {"x": "B"}},
            object2 = {"b": "X"};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "X"});
    });

    test("ExtendSubobjects", () => {
        expect.assertions(1);
        var object1 = {"b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"b": {"x": "M", "y": "N"}});
    });

    test("ExtendSubobjectsLeaveObj1PropsUntouched", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y", "z": "Z"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendSubobjectsAddProps", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendSubobjectsAddProps", () => {
        expect.assertions(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendBooleans", () => {
        expect.assertions(1);
        var object1 = {"a": true, "b": true},
            object2 = {"b": false};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": true, "b": false});
    });

    test("ExtendAddBooleans", () => {
        expect.assertions(1);
        var object1 = {"a": true, "b": true},
            object2 = {"c": false};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": true, "b": true, "c": false});
    });

    test("ExtendNumbers", () => {
        expect.assertions(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"b": 3};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 3});
    });

    test("ExtendNumbersWithZero", () => {
        expect.assertions(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"b": 0};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 0});
    });

    test("ExtendNumbersAddZero", () => {
        expect.assertions(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"c": 0};

        JSUtils.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 2, "c": 0});
    });
});

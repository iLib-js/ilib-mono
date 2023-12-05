/*
 * set.test.js - test the ISet class
 *
 * Copyright © 2015, 2017, 2023 2021, 2023 JEDLSoft
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

import ISet from '../src/ISet.js';

describe("testSet", () => {
    test("Constructor", () => {
        expect.assertions(1);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();
    });

    test("ConstructorIsEmpty", () => {
        expect.assertions(1);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();
    });

    test("ContainsEmpty", () => {
        expect.assertions(2);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();

        expect(!s.contains("foo")).toBeTruthy();
    });

    test("Add", () => {
        expect.assertions(2);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();

        s.add("foo");

        expect(s.contains("foo")).toBeTruthy();
    });

    test("AddAlreadyThere", () => {
        expect.assertions(3);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();

        s.add("foo");

        expect(s.contains("foo")).toBeTruthy();

        s.add("foo");

        expect(s.contains("foo")).toBeTruthy();
    });

    test("AddMultiple", () => {
        expect.assertions(5);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();

        s.add("foo");
        s.add("bar");
        s.add("asdf");

        expect(s.contains("foo")).toBeTruthy();
        expect(s.contains("bar")).toBeTruthy();
        expect(s.contains("asdf")).toBeTruthy();

        expect(!s.contains("qwerty")).toBeTruthy();
    });

    test("AddArray", () => {
        expect.assertions(5);
        var s = new ISet();
        expect(s.isEmpty()).toBeTruthy();

        s.add(["foo","bar","asdf"]);

        expect(s.contains("foo")).toBeTruthy();
        expect(s.contains("bar")).toBeTruthy();
        expect(s.contains("asdf")).toBeTruthy();

        expect(!s.contains("qwerty")).toBeTruthy();
    });

    test("ConstructorWithElementsIsNotEmpty", () => {
        expect.assertions(1);
        var s = new ISet(["foo", "bar", "asdf"]);
        expect(!s.isEmpty()).toBeTruthy();
    });

    test("ConstructorWithElementsContainsElements", () => {
        expect.assertions(3);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(s.contains("foo")).toBeTruthy();
        expect(s.contains("bar")).toBeTruthy();
        expect(s.contains("asdf")).toBeTruthy();
    });

    test("ConstructorWithElementsDoesNotContainBogusElements", () => {
        expect.assertions(1);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(!s.contains("qwerty")).toBeTruthy();
    });

    test("WithNumericElements", () => {
        expect.assertions(1);
        var s = new ISet();

        s.add(234);
        s.add(43);
        s.add(3433);

        expect(!s.isEmpty()).toBeTruthy();
    });

    test("WithNumericElementsContainsRightStuff", () => {
        expect.assertions(3);
        var s = new ISet();

        s.add(234);
        s.add(43);
        s.add(3433);

        expect(s.contains(234)).toBeTruthy();
        expect(s.contains(43)).toBeTruthy();
        expect(s.contains(3433)).toBeTruthy();
    });

    test("WithNumericElementsDoesNotContainsBogusStuff", () => {
        expect.assertions(3);
        var s = new ISet();

        s.add(234);
        s.add(43);
        s.add(3433);

        expect(!s.contains(1)).toBeTruthy();
        expect(!s.contains(23233)).toBeTruthy();
        expect(!s.contains(true)).toBeTruthy();
    });

    test("WithNumericArrayContainsRightStuff", () => {
        expect.assertions(3);
        var s = new ISet();

        s.add([234,43,3433]);

        expect(s.contains(234)).toBeTruthy();
        expect(s.contains(43)).toBeTruthy();
        expect(s.contains(3433)).toBeTruthy();
    });

    test("ConstructorWithNumericElements", () => {
        expect.assertions(1);
        var s = new ISet([1, 5, 9]);
        expect(!s.isEmpty()).toBeTruthy();
    });

    test("ConstructorWithNumericElementsContainsRightStuff", () => {
        expect.assertions(3);
        var s = new ISet([1, 5, 9]);
        expect(s.contains(1)).toBeTruthy();
        expect(s.contains(5)).toBeTruthy();
        expect(s.contains(9)).toBeTruthy();
    });

    test("AsArray", () => {
        expect.assertions(1);
        var s = new ISet(["foo", "bar", "asdf"]);

        var expected = ["foo", "bar", "asdf"];
        expect(s.asArray()).toEqual(expected);
    });

    test("AsArrayNumericAfterAddingStrings", () => {
        expect.assertions(1);
        var s = new ISet();

        s.add("foo");
        s.add("bar");
        s.add("asdf");

        var expected = ["foo", "bar", "asdf"];
        expect(s.asArray()).toEqual(expected);
    });

    test("AsArrayNumeric", () => {
        expect.assertions(1);
        var s = new ISet([1, 2, 3, 4]);

        var expected = [1, 2, 3, 4];
        expect(s.asArray()).toEqual(expected);
    });

    test("AsArrayNumericAfterAddingNumbers", () => {
        expect.assertions(1);
        var s = new ISet();

        s.add(1);
        s.add(2);
        s.add(3);
        s.add(4);

        var expected = [1, 2, 3, 4];
        expect(s.asArray()).toEqual(expected);
    });

    test("AsArrayEmpty", () => {
        expect.assertions(1);
        var s = new ISet();

        expect(s.asArray()).toEqual([]);
    });

    test("Remove", () => {
        expect.assertions(2);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(s.contains("bar")).toBeTruthy();

        s.remove("bar");

        expect(!s.contains("bar")).toBeTruthy();
    });

    test("RemoveLastElement", () => {
        expect.assertions(2);
        var s = new ISet(["bar"]);

        expect(s.contains("bar")).toBeTruthy();

        s.remove("bar");

        expect(!s.contains("bar")).toBeTruthy();
    });

    test("RemoveLastElementNowEmpty", () => {
        expect.assertions(2);
        var s = new ISet(["bar"]);

        expect(!s.isEmpty()).toBeTruthy();

        s.remove("bar");

        expect(s.isEmpty()).toBeTruthy();
    });

    test("RemoveNumeric", () => {
        expect.assertions(2);
        var s = new ISet([1, 2, 3, 4]);

        expect(s.contains(3)).toBeTruthy();

        s.remove(3);

        expect(!s.contains(3)).toBeTruthy();
    });

    test("RemoveNumericAsArray", () => {
        expect.assertions(2);
        var s = new ISet([1, 2, 3, 4]);

        var expected = [1, 2, 3, 4];
        expect(s.asArray()).toEqual(expected);

        s.remove(3);

        var expected = [1, 2, 4];
        expect(s.asArray()).toEqual(expected);
    });

    test("Clear", () => {
        expect.assertions(2);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(s.contains("bar")).toBeTruthy();

        s.clear();

        expect(!s.contains("bar")).toBeTruthy();
    });

    test("ClearNowEmpty", () => {
        expect.assertions(2);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(!s.isEmpty()).toBeTruthy();

        s.clear();

        expect(s.isEmpty()).toBeTruthy();
    });

    test("ToJsonString", () => {
        expect.assertions(1);
        var s = new ISet(["foo", "bar", "asdf"]);

        expect(s.toJson()).toEqual('["foo","bar","asdf"]');
    });

    test("ToJsonNumeric", () => {
        expect.assertions(1);
        var s = new ISet([1, 2, 3, 4]);

        expect(s.toJson()).toEqual("[1,2,3,4]");
    });

    test("ToJsonEmpty", () => {
        expect.assertions(1);
        var s = new ISet();

        expect(s.toJson()).toEqual('[]');
    });

});

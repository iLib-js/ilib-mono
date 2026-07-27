/*
 * testname_te_IN.js - test the name object in Telugu
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

describe("Name_te", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("te-IN");
        }
    });

    test("should parse a simple Telugu name", () => {
        expect.assertions(2);
        const parsed = new Name("రామ్ తేజ", {locale: 'te-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "రామ్",
            familyName: "తేజ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Telugu name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("రామ్ తేజ సీనియర్", {locale: 'te-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "సీనియర్",
            givenName: "రామ్",
            familyName: "తేజ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Telugu title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("మిస్టర్ తేజ", {locale: 'te-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "మిస్టర్",
            familyName: "తేజ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Telugu name", () => {
        expect.assertions(2);
        const parsed = new Name("మిస్టర్ మరియు మిస్ తేజ", {locale: 'te-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "మిస్టర్ మరియు మిస్",
            familyName: "తేజ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Telugu name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("మిస్టర్ రామ్ తేజ", {locale: 'te-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "మిస్టర్",
            givenName: "రామ్",
            familyName: "తేజ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Telugu name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "రామ్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Telugu name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "రామ్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Telugu name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "రామ్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a Telugu surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "మిస్టర్ మరియు మిస్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "మిస్టర్ మరియు మిస్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Telugu name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "డాక్టర్",
            givenName: "రామ్",
            familyName: "తేజ",
            suffix: "జూనియర్"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "డాక్టర్ రామ్ తేజ జూనియర్";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Telugu name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "డాక్టర్",
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "రామ్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Telugu name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "డాక్టర్",
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "రామ్ తేజ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Telugu name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "డాక్టర్",
            givenName: "రామ్",
            familyName: "తేజ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'te-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "డాక్టర్ రామ్ తేజ";

        expect(formatted).toBe(expected);
    });
});

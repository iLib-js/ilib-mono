/*
 * TMX.test.js - test the TMX object.
 *
 * Copyright © 2024 Box, Inc.
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

import path from 'path';
import fs from 'fs';
import TMX from '../src/tmx.js';
import {
    ResourceString,
    ResourceArray,
    ResourcePlural
} from 'ilib-tools-common';
import { Path } from 'ilib-common';

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

function diff(a, b) {
    const min = Math.min(a.length, b.length);

    for (let i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

const loctoolVersion = JSON.parse(fs.readFileSync(Path.join(__dirname, "..", "package.json"), "utf-8")).version;

describe("testTMX", () => {
    test("TMXConstructor", () => {
        expect.assertions(1);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();
    });

    test("TMXConstructorIsEmpty", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        expect(tmx.size()).toBe(0);
    });

    test("TMXConstructorFull", () => {
        expect.assertions(4);

        const tmx = new TMX({
            properties: {
                creationtool: "loctool",
                "tool-name": "Localization Tool",
                creationtoolversion: "1.2.34",
            },
        });
        expect(tmx).toBeTruthy();
        const props = tmx.getProperties();

        expect(props["creationtool"]).toBe("loctool");
        expect(props["creationtoolversion"]).toBe("1.2.34");
        expect(props["tool-name"]).toBe("Localization Tool");
    });

    test("TMXGetPath", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        tmx.setPath("test/testfiles/x.tmx");
        expect(tmx.getPath()).toBe("test/testfiles/x.tmx");
    });

    test("TMXSetPath", () => {
        expect.assertions(3);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        tmx.setPath("test/testfiles/x.tmx");
        expect(tmx.getPath()).toBe("test/testfiles/x.tmx");

        tmx.setPath("asdf/asdf/y.tmx");

        expect(tmx.getPath()).toBe("asdf/asdf/y.tmx");
    });

    test("TMXSetPathInitiallyEmpty", () => {
        expect.assertions(3);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        expect(!tmx.getPath()).toBeTruthy();

        tmx.setPath("asdf/asdf/y.tmx");

        expect(tmx.getPath()).toBe("asdf/asdf/y.tmx");
    });

    test("TMXAddResourceString", () => {
        expect.assertions(11);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceStringWithTranslation", () => {
        expect.assertions(12);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddMultipleResourceString", () => {
        expect.assertions(19);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(!units[0].comment).toBeTruthy();
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(!units[1].comment).toBeTruthy();
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddMultipleResourceStringWithTranslations", () => {
        expect.assertions(23);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(!units[0].comment).toBeTruthy();
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        expect(!units[1].comment).toBeTruthy();
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("vier fumpf sechs");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddMultipleResourceStringSameSource", () => {
        expect.assertions(15);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deu trois"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(!units[0].comment).toBeTruthy();
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        // should add a variant to the previous translation
        // unit instead of creating a new one
        expect(variants[2].string).toBe("un deu trois");
        expect(variants[2].locale).toBe("fr-FR");
    });

    test("TMXAddMultipleResourceStringSameSourceDifferentTranslation", () => {
        expect.assertions(14);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei",
            context: "a"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "a/b/cfoo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "sieben acht neun",
            context: "b"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("a");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        // should become a new variant of the source, even
        // though we already have a german translation
        expect(variants[2].string).toBe("sieben acht neun");
        expect(variants[2].locale).toBe("de-DE");
    });

    test("TMXAddResourceStringNotSourceLocale", () => {
        expect.assertions(3);

        const tmx = new TMX({
            locale: "en"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "en",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        // should reject it. Only units with the source
        // locale of en go in this tmx
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(0);
    });

    test("TMXAddMultipleResourceStringHandleDups", () => {
        expect.assertions(14);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        // should not duplicate the unit or the variants

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceArray", () => {
        expect.assertions(25);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        expect(units[0].source).toBe("a");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("b");
        expect(units[1].sourceLocale).toBe("en");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en");

        expect(units[2].source).toBe("c");
        expect(units[2].sourceLocale).toBe("en");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceArrayWithTranslations", () => {
        expect.assertions(31);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        expect(units[0].source).toBe("a");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("b");
        expect(units[1].sourceLocale).toBe("en");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].source).toBe("c");
        expect(units[2].sourceLocale).toBe("en");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceArrayMultiple", () => {
        expect.assertions(31);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "m",
                "n",
                "o"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(6);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("m");
        expect(variants[0].locale).toBe("en");

        variants = units[4].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("n");
        expect(variants[0].locale).toBe("en");

        variants = units[5].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceArrayMultipleWithTranslations", () => {
        expect.assertions(43);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "m",
                "n",
                "o"
            ],
            sourceLocale: "en",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "p",
                "q",
                "r"
            ]
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(6);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("m");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("p");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[4].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("n");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("q");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[5].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("r");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceArrayMultipleWithTranslationsAndOverlappingSources", () => {
        expect.assertions(43);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "o"
            ],
            sourceLocale: "en",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "p",
                "q",
                "r"
            ]
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("a");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("p");
        expect(variants[2].locale).toBe("de-DE");

        expect(units[1].source).toBe("b");
        expect(units[1].sourceLocale).toBe("en");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("q");
        expect(variants[2].locale).toBe("de-DE");

        expect(units[2].source).toBe("c");
        expect(units[2].sourceLocale).toBe("en");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].source).toBe("o");
        expect(units[3].sourceLocale).toBe("en");
        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("r");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourcePlural", () => {
        expect.assertions(19);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other string"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].sourceLocale).toBe("en");
        expect(units[0].source).toBe("one string");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(units[1].sourceLocale).toBe("en");
        expect(units[1].source).toBe("other string");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("other string");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourcePluralWithTranslations", () => {
        expect.assertions(23);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other string"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("one string");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("other string");
        expect(units[1].sourceLocale).toBe("en");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourcePluralMultiple", () => {
        expect.assertions(31);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "a string",
                other: "some strings"
            },
            sourceLocale: "en",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("one string");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("other strings");
        expect(units[1].sourceLocale).toBe("en");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en");

        expect(units[2].source).toBe("a string");
        expect(units[2].sourceLocale).toBe("en");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a string");
        expect(variants[0].locale).toBe("en");

        expect(units[3].source).toBe("some strings");
        expect(units[3].sourceLocale).toBe("en");
        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("some strings");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourcePluralMultipleWithMoreTranslations", () => {
        expect.assertions(33);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "a string",
                other: "many strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "ru-RU",
            targetStrings: {
                one: "одна струна",
                few: "несколько струны",
                other: "много струн"
            }
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("одна струна");
        expect(variants[1].locale).toBe("ru-RU");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("many strings");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("много струн");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("несколько струны");
        expect(variants[2].locale).toBe("ru-RU");
    });

    test("TMXAddResourcePluralMultipleWithLessTranslations", () => {
        expect.assertions(21);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "ja-JP",
            targetStrings: {
                other: "1つの弦"
            }
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("1つの弦");
        expect(variants[2].locale).toBe("ja-JP");
    });

    test("TMXAddResourcePluralMultipleWithTranslationsAndOverlappingSources", () => {
        expect.assertions(27);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "some other strings"
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "1 Zeichenfolge",
                other: "mehrere andere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        // the "one" string shares some translations and the "other" string doesn't
        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eine Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("1 Zeichenfolge");
        expect(variants[2].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("some other strings");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("mehrere andere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXDeserializeSimple", () => {
        expect.assertions(1);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(1);
    });

    test("TMXDeserializeSimpleRightTransUnits", () => {
        expect.assertions(6);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(1);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");
    });

    test("TMXDeserializeSimpleRightVariants", () => {
        expect.assertions(11);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(1);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXDeserializeSimpleHeaderProperties", () => {
        expect.assertions(8);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(1);
        expect(tmx.getSegmentationType()).toBe("paragraph");

        const tmxprops = tmx.getProperties();
        expect(tmxprops).toBeTruthy();
        expect(tmxprops["creationtool"]).toBe("loctool");
        expect(tmxprops["creationtoolversion"]).toBe("2.20.2");
        expect(tmxprops["adminlang"]).toBe("en-US");
        expect(tmxprops["srclang"]).toBe("en-US");
        expect(tmxprops["datatype"]).toBe("javascript");
    });

    test("TMXDeserializeUnitsSrclangIsDifferentThanHeaderSrclang", () => {
        expect.assertions(21);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" srclang="en-US" adminlang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Foobar</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Das Foobar</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(2);
        expect(tmx.sourceLocale).toBe("en-US");

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].sourceLocale).toBe("en");
        expect(units[1].sourceLocale).toBe("en");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Foobar");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Das Foobar");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXDeserializeNoSrclangHeaderAttrAtAll", () => {
        expect.assertions(21);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Foobar</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Das Foobar</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(2);
        expect(tmx.sourceLocale).toBe("en");

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].sourceLocale).toBe("en");
        expect(units[1].sourceLocale).toBe("en");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Foobar");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Das Foobar");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXDeserializeRightDatatype", () => {
        expect.assertions(7);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" srclang="en-US" adminlang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Foobar</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Das Foobar</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(2);
        expect(tmx.sourceLocale).toBe("en-US");

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].datatype).toBe("javascript");
        expect(units[1].datatype).toBe("javascript");
    });

    test("TMXDeserializeSimpleTransUnitProperties", () => {
        expect.assertions(6);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="javascript"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(1);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
    });

    test("TMXDeserializeStringMultipleWithTranslations", () => {
        expect.assertions(1);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>a</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>x</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(6);
    });

    test("TMXDeserializeStringMultipleWithTranslationsRightContents", () => {
        expect.assertions(6);

        const tmx = new TMX();

        const contents = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.20.2" adminlang="en-US" srclang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>a</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>x</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        tmx.deserialize(contents);

        expect(tmx.size()).toBe(6);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(6);

        let actual = units.map(tu => [tu.source, tu.sourceLocale]);
        let expected = [
            ["Asdf asdf", "en-US"],
            ["one string", "en-US"],
            ["other strings", "en-US"],
            ["a", "en-US"],
            ["b", "en-US"],
            ["c", "en-US"]
        ];
        expect(actual).toEqual(expected);

        actual = units.map(tu => {
            const variants = tu.getVariants();
            return variants.map(variant => [variant.string, variant.locale]);
        });
        expected = [
            [["Asdf asdf", "en-US"], ["eins zwei drei", "de-DE"]],
            [["one string", "en-US"], ["eine Zeichenfolge", "de-DE"]],
            [["other strings", "en-US"], ["mehrere Zeichenfolge", "de-DE"]],
            [["a", "en-US"], ["x", "de-DE"]],
            [["b", "en-US"], ["y", "de-DE"]],
            [["c", "en-US"], ["z", "de-DE"]]
        ];
        expect(actual).toEqual(expected);
    });

    test("TMXSerializeStringMultipleWithTranslations", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "foobar auf deutsch",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "foobar en francais",
            targetLocale: "fr-FR"
        });

        tmx.addResource(res);

        const actual = tmx.serialize();
        const expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" adminlang="en" srclang="en" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>foobar auf deutsch</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="fr-FR">\n' +
            '        <seg>foobar en francais</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TMXSerializeString", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        const actual = tmx.serialize();
        const expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" adminlang="en" srclang="en" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>baby baby</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>vier fumpf sechs</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TMXSerializeComplex", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "blah blah",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        const actual = tmx.serialize();
        const expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" adminlang="en" srclang="en" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>a</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>x</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TMXAddResourceSegmentSentenceSource", () => {
        expect.assertions(23);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceSegmentSentenceSourceTricky", () => {
        expect.assertions(23);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "I would like to see Dr. Smith in the U.S. not someone else. Please arrange that.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("I would like to see Dr. Smith in the U.S. not someone else.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("I would like to see Dr. Smith in the U.S. not someone else.");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("Please arrange that.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Please arrange that.");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceSegmentSentenceSourceOnlyOneSentence", () => {
        expect.assertions(13);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "This is a test.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceSegmentSentenceTarget", () => {
        expect.assertions(27);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentenceTargetJapanese", () => {
        expect.assertions(27);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "これはテストです。これは単なるテストです。",
            targetLocale: "ja-JP"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("これはテストです。");
        expect(variants[1].locale).toBe("ja-JP");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("これは単なるテストです。");
        expect(variants[1].locale).toBe("ja-JP");
    });

    test("TMXAddResourceSegmentSentenceTargetOnlyOneSentence", () => {
        expect.assertions(15);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "This is a test.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "Dies ist eine Untersuchung.",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        const props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentenceArray", () => {
        expect.assertions(23);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test."
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceSegmentSentenceTargetArray", () => {
        expect.assertions(27);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test."
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetArray: [
                "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung."
            ],
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentenceTargetArrayMultiple", () => {
        expect.assertions(51);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test.",
                "Yet another test. Another test."
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetArray: [
                "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
                "Jemals noch eine Untersuchung. Noch eine Untersuchung."
            ],
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].source).toBe("Yet another test.");
        expect(units[2].sourceLocale).toBe("en");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Jemals noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].source).toBe("Another test.");
        expect(units[3].sourceLocale).toBe("en");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentencePlural", () => {
        expect.assertions(23);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourcePlurals: {
                other: "This is a test. This is only a test."
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");
    });

    test("TMXAddResourceSegmentSentenceTargetPlural", () => {
        expect.assertions(27);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourcePlurals: {
                "other": "This is a test. This is only a test."
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                "other": "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung."
            },
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentenceTargetPluralMultiple", () => {
        expect.assertions(51);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "Yet another test. Another test."
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                one: "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
                other: "Jemals noch eine Untersuchung. Noch eine Untersuchung."
            },
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].source).toBe("Yet another test.");
        expect(units[2].sourceLocale).toBe("en");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Jemals noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].source).toBe("Another test.");
        expect(units[3].sourceLocale).toBe("en");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXAddResourceSegmentSentenceTargetPluralLessCategories", () => {
        expect.assertions(47);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "Yet another test. Another test."
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                other: "さらに別のテスト。別のテスト。"
            },
            targetLocale: "ja-JP"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(units[2].source).toBe("Yet another test.");
        expect(units[2].sourceLocale).toBe("en");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("さらに別のテスト。");
        expect(variants[1].locale).toBe("ja-JP");

        expect(units[3].source).toBe("Another test.");
        expect(units[3].sourceLocale).toBe("en");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("別のテスト。");
        expect(variants[1].locale).toBe("ja-JP");
    });

    test("TMXAddResourceSegmentSentenceTargetPluralMoreCategories", () => {
        expect.assertions(55);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "These are some tests. These are only some tests."
            },
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                one: "Это тест. Это всего лишь тест.",
                few: "Это некоторые теста. Это только некоторые теста.",
                other: "Это некоторые тестов. Это только некоторые тестов."
            },
            targetLocale: "ru-RU"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].source).toBe("This is a test.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Это тест.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(units[1].source).toBe("This is only a test.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Это всего лишь тест.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(units[2].source).toBe("These are some tests.");
        expect(units[2].sourceLocale).toBe("en");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("These are some tests.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Это некоторые тестов.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("Это некоторые теста.");
        expect(variants[2].locale).toBe("ru-RU");

        expect(units[3].source).toBe("These are only some tests.");
        expect(units[3].sourceLocale).toBe("en");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("These are only some tests.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Это только некоторые тестов.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("Это только некоторые теста.");
        expect(variants[2].locale).toBe("ru-RU");
    });

    test("TMXWrite", () => {
        expect.assertions(4);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf. Foobar foo.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "Eins zwei drei. Vier fumpf sechs."
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en",
            key: "blah blah",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "A b cee. E f g.",
                "b",
                "c"
            ],
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "X y zee. M n o.",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        const base = __dirname;

        if (fs.existsSync(path.join(base, "testfiles/test/output.tmx"))) {
            fs.unlinkSync(path.join(base, "testfiles/test/output.tmx"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/test/output.tmx"))).toBeTruthy();

        tmx.setPath("./test/output.tmx");
        tmx.write(path.join(base, "testfiles"));

        expect(fs.existsSync(path.join(base, "testfiles/test/output.tmx"))).toBeTruthy();

        const actual = fs.readFileSync(path.join(base, "testfiles/test/output.tmx"), "utf-8");
        const expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="sentence" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" adminlang="en" srclang="en" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Eins zwei drei.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Foobar foo.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Vier fumpf sechs.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>A b cee.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>X y zee.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>E f g.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>M n o.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TMXAddResourceSegmentSentenceTargetSpecial", () => {
        expect.assertions(27);

        const tmx = new TMX({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        const res = new ResourceString({
            source: "The SignRequest subdomain cannot be changed. If you need a different domain you can create a new team.",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "SignRequest domänen kan inte ändras. Om du behöver en annan domän kan du skapa en nya arbetsgrupp.",
            targetLocale: "sv"
        });

        tmx.addResource(res);

        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("The SignRequest subdomain cannot be changed.");
        expect(units[0].sourceLocale).toBe("en");
        let props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("The SignRequest subdomain cannot be changed.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("SignRequest domänen kan inte ändras.");
        expect(variants[1].locale).toBe("sv");

        expect(units[1].source).toBe("If you need a different domain you can create a new team.");
        expect(units[1].sourceLocale).toBe("en");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("If you need a different domain you can create a new team.");
        expect(variants[0].locale).toBe("en");

        expect(variants[1].string).toBe("Om du behöver en annan domän kan du skapa en nya arbetsgrupp.");
        expect(variants[1].locale).toBe("sv");
    });

    test("TMXSerializeStringDontSerializeUnitsWithNoTranslations", () => {
        expect.assertions(2);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        // source-only resource should not appear in the serialized output
        res = new ResourceString({
            source: "oh yeah!",
            sourceLocale: "en",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        const actual = tmx.serialize();
        const expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" adminlang="en" srclang="en" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en">\n' +
            '        <seg>baby baby</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>vier fumpf sechs</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });
});

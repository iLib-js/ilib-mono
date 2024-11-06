/*
 * merge.test.js - test the tmxtool merge function
 *
 * Copyright © 2023-2024 JEDLSoft
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

import TMX from 'ilib-tmx';
import { TranslationUnit } from 'ilib-tools-common';

import merge from '../src/merge.js';

describe("testmerge", () => {
    test("MergeNormal", () => {
        expect.assertions(22);

        merge({
            opt: {
                outputfile: "./test/testfiles/merge.tmx"
            }
        }, ["./test/testfiles/test1.tmx", "./test/testfiles/test2.tmx"]);

        const mergetmx = new TMX({
            path: "./test/testfiles/merge.tmx"
        });

        expect(mergetmx.size()).toBe(2);

        const units = mergetmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        expect(units[1].source).toBe("baby baby");
        expect(units[1].sourceLocale).toBe("en-US");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("vier fumpf sechs");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("MergeNoDifference", () => {
        expect.assertions(13);

        merge({
            opt: {
                outputfile: "./test/testfiles/merge.tmx"
            }
        }, ["./test/testfiles/test1.tmx", "./test/testfiles/test1.tmx"]);

        const mergetmx = new TMX({
            path: "./test/testfiles/merge.tmx"
        });

        expect(mergetmx.size()).toBe(1);

        const units = mergetmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("MergeWithVariants", () => {
        expect.assertions(24);

        merge({
            opt: {
                outputfile: "./test/testfiles/merge.tmx"
            }
        }, ["./test/testfiles/testvariants1.tmx", "./test/testfiles/testvariants2.tmx"]);

        const mergetmx = new TMX({
            path: "./test/testfiles/merge.tmx"
        });

        expect(mergetmx.size()).toBe(2);

        const units = mergetmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        expect(units[1].source).toBe("baby baby");
        expect(units[1].sourceLocale).toBe("en-US");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("vier fumpf sechs");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("quatre cinq six");
        expect(variants[2].locale).toBe("fr-FR");
    });
});

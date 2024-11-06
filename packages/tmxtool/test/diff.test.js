/*
 * diff.test.js - test the tmxtool diff function
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

import diff from '../src/diff.js';

describe("testdiff", () => {
    test("DiffNormal", () => {
        expect.assertions(13);

        diff({
            opt: {
                outputfile: "./test/testfiles/diff.tmx"
            }
        }, "./test/testfiles/test1.tmx", "./test/testfiles/test2.tmx");

        const difftmx = new TMX({
            path: "./test/testfiles/diff.tmx"
        });

        expect(difftmx.size()).toBe(1);

        const units = difftmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("baby baby");
        expect(units[0].sourceLocale).toBe("en-US");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("vier fumpf sechs");
        expect(variants[1].locale).toBe("de-DE");
    });


    test("DiffNoDifference", () => {
        expect.assertions(4);

        diff({
            opt: {
                outputfile: "./test/testfiles/diff.tmx"
            }
        }, "./test/testfiles/test1.tmx", "./test/testfiles/test1.tmx");

        const difftmx = new TMX({
            path: "./test/testfiles/diff.tmx"
        });

        expect(difftmx.size()).toBe(0);

        const units = difftmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(0);
    });

    test("DiffWithVariants", () => {
        expect.assertions(13);

        diff({
            opt: {
                outputfile: "./test/testfiles/diff.tmx"
            }
        }, "./test/testfiles/testvariants1.tmx", "./test/testfiles/testvariants2.tmx");

        const difftmx = new TMX({
            path: "./test/testfiles/diff.tmx"
        });

        expect(difftmx.size()).toBe(1);

        const units = difftmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].source).toBe("baby baby");
        expect(units[0].sourceLocale).toBe("en-US");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("quatre cinq six");
        expect(variants[1].locale).toBe("fr-FR");
    });
});

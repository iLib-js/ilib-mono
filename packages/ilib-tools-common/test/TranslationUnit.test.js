/*
 * TranslationUnit.test.js - test the translation unit object.
 *
 * Copyright © 2023 JEDLSoft
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

import { TranslationUnit, TranslationVariant } from "../src/index.js";

describe("testTranslationUnit", () => {
     test("TranslationUnitConstructor", () => {
        expect.assertions(1);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();
    });

    test("TranslationUnitConstructorWithFields", () => {
        expect.assertions(1);

        const tu = new TranslationUnit({
            source: "a",
            sourceLocale: "en-US",
            key: "key",
            file: "a/b/c.js",
            project: "bigproject",
            target: "b",
            targetLocale: "de-DE",
            resType: "string",
            state: "translated",
            comment: "no comment",
            datatype: "javascript",
            flavor: "chocolate"
        });
        expect(tu).toBeTruthy();
    });

    test("TranslationUnitConstructorWithMissingRequiredFields", () => {
        expect.assertions(1);

        expect(() => {
            const tu = new TranslationUnit({
                source: "a",
                target: "b",
                targetLocale: "de-DE",
                resType: "string",
                state: "translated",
                comment: "no comment",
                datatype: "javascript",
                flavor: "chocolate"
            });
        }).toThrow();
    });

    test("TranslationUnitConstructorWithMissingOptionalFields", () => {
        expect.assertions(1);

        const tu = new TranslationUnit({
            source: "a",
            sourceLocale: "en-US",
            key: "key",
            file: "a/b/c.js",
            project: "bigproject"
        });
        expect(tu).toBeTruthy();
    });

    test("TranslationUnitRightFields", () => {
        expect.assertions(15);

        const tu = new TranslationUnit({
            source: "a",
            sourceLocale: "en-US",
            key: "key",
            file: "a/b/c.js",
            project: "bigproject",
            target: "b",
            targetLocale: "de-DE",
            resType: "string",
            state: "translated",
            comment: "no comment",
            datatype: "javascript",
            flavor: "chocolate",
            translate: true,
            location: {
                offset: 23,
                line: 3,
                char: 12
            }
        });
        expect(tu).toBeTruthy();

        expect(tu.source).toBe("a");
        expect(tu.sourceLocale).toBe("en-US");
        expect(tu.key).toBe("key");
        expect(tu.file).toBe("a/b/c.js");
        expect(tu.project).toBe("bigproject");
        expect(tu.target).toBe("b");
        expect(tu.targetLocale).toBe("de-DE");
        expect(tu.resType).toBe("string");
        expect(tu.state).toBe("translated");
        expect(tu.comment).toBe("no comment");
        expect(tu.datatype).toBe("javascript");
        expect(tu.flavor).toBe("chocolate");
        expect(tu.translate).toBeTruthy();
        expect(tu.location).toStrictEqual({
            offset: 23,
            line: 3,
            char: 12
        });
    });

    test("TranslationUnitAddVariant", () => {
        expect.assertions(5);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        tu.addVariant(new TranslationVariant({
            locale: "de-DE",
            string: "Zeichenfolge"
        }));

        variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(1);
    });

    test("TranslationUnitAddVariantRightOne", () => {
        expect.assertions(5);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants;

        tu.addVariant(new TranslationVariant({
            locale: "de-DE",
            string: "Zeichenfolge"
        }));

        variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].locale).toBe("de-DE");
        expect(variants[0].string).toBe("Zeichenfolge");
    });

    test("TranslationUnitAddVariants", () => {
        expect.assertions(5);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        tu.addVariants([
            new TranslationVariant({
                locale: "de-DE",
                string: "Zeichenfolge"
            }),
            new TranslationVariant({
                locale: "nl-NL",
                string: "string"
            })
        ]);

        variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);
    });

    test("TranslationUnitGetVariantsWithLocale", () => {
        expect.assertions(13);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        tu.addVariants([
            new TranslationVariant({
                locale: "de-DE",
                string: "Zeichenfolge"
            }),
            new TranslationVariant({
                locale: "nl-NL",
                string: "string"
            })
        ]);

        variants = tu.getVariants("nl-NL");
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(1);
        expect(variants[0].locale).toBe("nl-NL");
        expect(variants[0].string).toBe("string");

        variants = tu.getVariants("de-DE");
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(1);
        expect(variants[0].locale).toBe("de-DE");
        expect(variants[0].string).toBe("Zeichenfolge");
    });

    test("TranslationUnitGetVariantsMultipleWithLocale", () => {
        expect.assertions(10);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        tu.addVariants([
            new TranslationVariant({
                locale: "de-DE",
                string: "Zeichenfolge"
            }),
            new TranslationVariant({
                locale: "nl-NL",
                string: "string"
            }),
            new TranslationVariant({
                locale: "de-DE",
                string: "String"
            }),
        ]);

        variants = tu.getVariants("de-DE");
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);
        expect(variants[0].locale).toBe("de-DE");
        expect(variants[0].string).toBe("Zeichenfolge");

        expect(variants[1].locale).toBe("de-DE");
        expect(variants[1].string).toBe("String");
    });

    test("TranslationUnitGetVariantsNotThere", () => {
        expect.assertions(6);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        tu.addVariants([
            new TranslationVariant({
                locale: "de-DE",
                string: "Zeichenfolge"
            }),
            new TranslationVariant({
                locale: "nl-NL",
                string: "string"
            })
        ]);

        variants = tu.getVariants("ja-JP");
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);
    });

    test("TranslationUnitGetVariantsNoneThere", () => {
        expect.assertions(6);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        let variants = tu.getVariants();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);

        const variant = tu.getVariants("ja-JP");
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(0);
    });

    test("TranslationUnitNoProperties", () => {
        expect.assertions(2);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        expect(tu.getProperties()).toStrictEqual({});
    });

    test("TranslationUnitAddProperties", () => {
        expect.assertions(3);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        expect(tu.getProperties()).toStrictEqual({});
        tu.addProperties({
            foo: "bar",
            asdf: "asdf"
        });
        expect(tu.getProperties()).toStrictEqual({
            foo: "bar",
            asdf: "asdf"
        });
    });

    test("TranslationUnitAddPropertiesAdditive", () => {
        expect.assertions(3);

        const tu = new TranslationUnit();
        expect(tu).toBeTruthy();

        expect(tu.getProperties()).toStrictEqual({});
        tu.addProperties({
            foo: "bar",
            asdf: "asdf"
        });
        tu.addProperties({
            x: "y",
            m: "n"
        });
        expect(tu.getProperties()).toStrictEqual({
            foo: "bar",
            asdf: "asdf",
            x: "y",
            m: "n"
        });
    });

    test("TranslationUnitHashKey", () => {
        expect.assertions(2);

        const tu = new TranslationUnit({
            source: "a",
            sourceLocale: "en-US",
            key: "key",
            file: "a/b/c.js",
            project: "bigproject",
            target: "b",
            targetLocale: "de-DE",
            resType: "string",
            state: "translated",
            comment: "no comment",
            datatype: "javascript",
            flavor: "chocolate"
        });
        expect(tu).toBeTruthy();
        expect(tu.hashKey()).toBe("r6355537_en-US_javascript");
    });
});

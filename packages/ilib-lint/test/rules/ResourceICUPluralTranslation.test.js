/*
 * ResourceICUPluralTranslation.test.js - test that the translations in
 * ICU/formatjs plurals are different than the source
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
import { ResourceString } from 'ilib-tools-common';

import ResourceICUPluralTranslation from "../../src/rules/ResourceICUPluralTranslation.js";

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceICUPluralTranslation", () => {
    test("ResourceICUPluralTranslationsMatchNoError", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {gibt # Datei} other {gibt # Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslation", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {is # file} other {gibt # Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'one' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>one {is # file}</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'one {is # file}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslations it's not a missing translation if the only thing in the plural string is a variable", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {{filename}} other {# files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {{filename}} other {# Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeFalsy();
    });

    test("ResourceICUPluralTranslations it's not a missing translation if the only thing in the plural string is whitespace", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {   } other {# files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {     } other {# Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeFalsy();
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationNestedLevel2", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {are # files and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {gibt # Datei und {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {gibt # Dateien und {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(4);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslations not a missing translation if there is no translatable text level 2", () => {
         expect.assertions(2);

         const rule = new ResourceICUPluralTranslation();
         expect(rule).toBeTruthy();

         const actual = rule.match({
             ir: new IntermediateRepresentation({
                 type: "resource",
                 ir: [new ResourceString({
                     key: "plural.test",
                     sourceLocale: "en-US",
                     source: 'There {count, plural, one {is # file and {folderCount, plural, one {{folderCount}} other {{folderCount} folders}}} other {are # files and {folderCount, plural, one {{folderCount}} other {{folderCount} folders}}}} in the folder.',
                     targetLocale: "de-DE",
                     target: "Es {count, plural, one {gibt # Datei und {folderCount, plural, one {{folderCount}} other {{folderCount} Ordner}}} other {gibt # Dateien und {folderCount, plural, one {{folderCount}} other {{folderCount} Ordner}}}} in dem Ordner.",
                     pathName: "a/b/c.xliff"
                 })],
                 sourceFile
             }),
             file: "a/b/c.xliff"
         });
         expect(actual).toBeFalsy();
     });

    test("ResourceICUPluralTranslationsMatchNotMissingTranslationWithTags", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in the folder.',
                    targetLocale: "de-DE",
                    target: "Er <tagName> {folderCount, plural, one {ist {folderCount} Ordner} other {zeit {folderCount} Ordner}} </tagName> in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationWithTags", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in the folder.',
                    targetLocale: "de-DE",
                    target: "Er <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is {folderCount} folder}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {is {folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are {folderCount} folders}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {are {folderCount} folders}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationNestedLevel2WithTags", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file and <tagName> {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}} </tagName>} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {gibt # Datei und <tagName> {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}} </tagName>} other {gibt # Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationWithNumberDateTime", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file and {num, number, currency/GBP} {date, date, medium} {time, time, medium}} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {gibt # Datei und {num, number, currency/GBP} {date, date, medium} {time, time, medium}} other {gibt # Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationSelectOrdinal", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {num, selectordinal, one {first} two {second} other {nth}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {num, selectordinal, one {first} two {second} other {nth}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {first}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {first}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'two' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>two {second}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'two {second}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {nth}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {nth}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationSelect", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {foo, select, male {male string} female {female string} other {other string}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {foo, select, male {male string} female {female string} other {other string}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'male' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>male {male string}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'male {male string}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'female' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>female {female string}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'female {female string}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {other string}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {other string}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsMatchMissingTranslationNestedLevel1ButNotLevel2", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {are # files and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {is # file and {folderCount, plural, one {{folderCount} Ordner} other {{folderCount} Ordner}}} other {are # files and {folderCount, plural, one {{folderCount} Ordner} other {{folderCount} Ordner}}}} in the folder.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is # file and {plural}}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'one {is # file and {plural}}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are # files and {plural}}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: 'other {are # files and {plural}}'
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsAddCategoryTranslated", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "ru-RU",
                    target: 'There {count, plural, one {is # file (Russian)} few {are # files (Russian)} other {are # files (Russian)}} in the folder.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsAddCategoryNotTranslated", () => {
        expect.assertions(5);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "ru-RU",
                    target: 'There {count, plural, one {is # file} few {are # files} other {are # files}} in the folder.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is # file}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "ru-RU",
                source: 'one {is # file}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'few' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>few {are # files}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "ru-RU",
                source: 'other {are # files}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are # files}</e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "ru-RU",
                source: 'other {are # files}'
            }),
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsSubtractCategoryTranslated", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "ja-JP",
                    target: 'There {count, plural, other {are # files (Japanese)}} in the folder.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsSubtractCategoryNotTranslated", () => {
        expect.assertions(3);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "ja-JP",
                    target: 'There {count, plural, other {are # files}} in the folder.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();

        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'other' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>other {are # files}</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "ja-JP",
            source: 'other {are # files}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceICUPluralTranslationsNonPlural", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Maximum custodians',
                    targetLocale: "fr-FR",
                    target: "Depositaires maximaux",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsNonPluralWithOtherFormatjsStuff", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Maximum {max} custodians',
                    targetLocale: "fr-FR",
                    target: "Depositaires maximaux {max}",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsNoCrashIfSourceHasPluralTargetDoesnt", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es gibt Dateien in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsIgnoreEmptyCategories", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {# file} other {}} in the folder.',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {# Datei} other {}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceICUPluralTranslationsIgnoreMissingTranslation", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {# file} other {}} in the folder.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("Rule should not match on categories that have no text to translate", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Downloading {count, plural, one {{count}} other {# files}}',
                    pathName: "a/b/c.xliff",
                    targetLocale: "pl-PL",
                    target: "Pobieranie {count, plural, one {{count}} other {# plików}}"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("Rule should produce a warning when source and target match and there are no exceptions", () => {
        expect.assertions(18);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Download of # {count, plural, one {File} other {Files}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Download del # {count, plural, one {File} other {Files}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(2);
        expect(actual[0].locale).toBe("it-IT");
        expect(actual[0].source).toBe('one {File}');
        expect(actual[0].highlight).toBe('Target: <e0>one {File}</e0>');
        expect(actual[0].description).toBe("Translation of the category 'one' is the same as the source.");
        expect(actual[0].id).toBe("plural.test");
        expect(actual[0].rule).toBe(rule);
        expect(actual[0].pathName).toBe("a/b/c.xliff");
        expect(actual[1].locale).toBe("it-IT");
        expect(actual[1].source).toBe('other {Files}');
        expect(actual[1].highlight).toBe('Target: <e0>other {Files}</e0>');
        expect(actual[1].description).toBe("Translation of the category 'other' is the same as the source.");
        expect(actual[1].id).toBe("plural.test");
        expect(actual[1].rule).toBe(rule);
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("Rule should ignore exceptions when source and target match and there are exceptions", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["File", "Files", "Email", "Download"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Download of # {count, plural, one {File} other {Files}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Download del # {count, plural, one {File} other {Files}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("Rule should ignore exceptions when source and target match and there are exceptions with multiple words in them", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["# File", "# Files", "Email", "Download"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'Download of {count, plural, one {# File} other {# Files}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Download del {count, plural, one {# File} other {# Files}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("Rule should still report warnings for non-exception words", () => {
        expect.assertions(4);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["File", "Files", "Email", "Download"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # folder} other {are # folders}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Ci {count, plural, one {is # folder} other {sono # folders}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(!Array.isArray(actual)).toBeTruthy();

        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'one' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>one {is # folder}</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "it-IT",
            source: 'one {is # folder}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("Rule should handle case-insensitive exception matching", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["file", "email", "download"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # File} other {are # Files}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Ci {count, plural, one {è # File} other {sono # Files}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("Rule should not match partial exceptions", () => {
        expect.assertions(4);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["File", "Files", "Email", "Download"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # File name} other {are # File names}} in the folder.',
                    targetLocale: "it-IT",
                    target: "Ci {count, plural, one {is # File name} other {sono # File names}} nella cartella.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(!Array.isArray(actual)).toBeTruthy();

        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'one' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>one {is # File name}</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "it-IT",
            source: 'one {is # File name}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("Rule should work with multiple locales having different exceptions", () => {
        expect.assertions(2);

        const rule = new ResourceICUPluralTranslation({
            exceptions: {
                "it-IT": ["File", "Files", "Email"],
                "de-DE": ["Download", "Upload"]
            }
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # File} other {are # Files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {is # File} other {gibt # Files}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
    });

    test("Rule should produce Result instance without exceptions parameter", () => {
        expect.assertions(4);

        const rule = new ResourceICUPluralTranslation();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                    targetLocale: "de-DE",
                    target: "Es {count, plural, one {is # file} other {gibt # Dateien}} in dem Ordner.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            }),
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(!Array.isArray(actual)).toBeTruthy();

        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'one' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>one {is # file}</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'one {is # file}'
        });
        expect(actual).toStrictEqual(expected);
    });


});


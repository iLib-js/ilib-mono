/*
 * testResourceICUPluralTranslation.js - test that the translations in
 * ICU/formatjs plurals are different than the source
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
import { ResourceString } from 'ilib-tools-common';

import ResourceICUPluralTranslation from "../src/rules/ResourceICUPluralTranslation.js";

import { Result } from 'i18nlint-common';

export const testResourceICUPluralTranslation = {
    testResourceICUPluralTranslationsMatchNoError: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {gibt # Datei} other {gibt # Dateien}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslation: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {is # file} other {gibt # Dateien}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'one' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>one {is # file}</e0>',
            rule,
            pathName: "x/y",
            locale: "de-DE",
            source: 'one {is # file}'
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationNestedLevel2: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {are # files and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {gibt # Datei und {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {gibt # Dateien und {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 4);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchNotMissingTranslationWithTags: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in the folder.',
                targetLocale: "de-DE",
                target: "Er <tagName> {folderCount, plural, one {ist {folderCount} Ordner} other {zeit {folderCount} Ordner}} </tagName> in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationWithTags: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in the folder.',
                targetLocale: "de-DE",
                target: "Er <tagName> {folderCount, plural, one {is {folderCount} folder} other {are {folderCount} folders}} </tagName> in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is {folderCount} folder}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {is {folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are {folderCount} folders}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {are {folderCount} folders}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationNestedLevel2WithTags: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file and <tagName> {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}} </tagName>} other {are # files}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {gibt # Datei und <tagName> {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}} </tagName>} other {gibt # Dateien}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {{folderCount} folder}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {{folderCount} folder}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {{folderCount} folders}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {{folderCount} folders}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationWithNumberDateTime: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file and {num, number, currency/GBP} {date, date, medium} {time, time, medium}} other {are # files}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {gibt # Datei und {num, number, currency/GBP} {date, date, medium} {time, time, medium}} other {gibt # Dateien}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationSelectOrdinal: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {num, selectordinal, one {first} two {second} other {nth}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {num, selectordinal, one {first} two {second} other {nth}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {first}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {first}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'two' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>two {second}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'two {second}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {nth}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {nth}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationSelect: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {foo, select, male {male string} female {female string} other {other string}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {foo, select, male {male string} female {female string} other {other string}} in dem Ordner.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'male' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>male {male string}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'male {male string}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'female' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>female {female string}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'female {female string}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {other string}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {other string}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsMatchMissingTranslationNestedLevel1ButNotLevel2: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}} other {are # files and {folderCount, plural, one {{folderCount} folder} other {{folderCount} folders}}}} in the folder.',
                targetLocale: "de-DE",
                target: "Es {count, plural, one {is # file and {folderCount, plural, one {{folderCount} Ordner} other {{folderCount} Ordner}}} other {are # files and {folderCount, plural, one {{folderCount} Ordner} other {{folderCount} Ordner}}}} in the folder.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 2);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is # file and {plural}}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'one {is # file and {plural}}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are # files and {plural}}</e0>',
                rule,
                pathName: "x/y",
                locale: "de-DE",
                source: 'other {are # files and {plural}}'
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsAddCategoryTranslated: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "ru-RU",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "ru-RU",
                target: 'There {count, plural, one {is # file (Russian)} few {are # files (Russian)} other {are # files (Russian)}} in the folder.',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsAddCategoryNotTranslated: function(test) {
        test.expect(5);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "ru-RU",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "ru-RU",
                target: 'There {count, plural, one {is # file} few {are # files} other {are # files}} in the folder.',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 3);

        const expected = [
            new Result({
                severity: "warning",
                description: "Translation of the category 'one' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>one {is # file}</e0>',
                rule,
                pathName: "x/y",
                locale: "ru-RU",
                source: 'one {is # file}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'few' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>few {are # files}</e0>',
                rule,
                pathName: "x/y",
                locale: "ru-RU",
                source: 'other {are # files}'
            }),
            new Result({
                severity: "warning",
                description: "Translation of the category 'other' is the same as the source.",
                id: "plural.test",
                highlight: 'Target: <e0>other {are # files}</e0>',
                rule,
                pathName: "x/y",
                locale: "ru-RU",
                source: 'other {are # files}'
            }),
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsSubtractCategoryTranslated: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "ja-JP",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "ja-JP",
                target: 'There {count, plural, other {are # files (Japanese)}} in the folder.',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsSubtractCategoryNotTranslated: function(test) {
        test.expect(3);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "ja-JP",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'There {count, plural, one {is # file} other {are # files}} in the folder.',
                targetLocale: "ja-JP",
                target: 'There {count, plural, other {are # files}} in the folder.',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);

        const expected = new Result({
            severity: "warning",
            description: "Translation of the category 'other' is the same as the source.",
            id: "plural.test",
            highlight: 'Target: <e0>other {are # files}</e0>',
            rule,
            pathName: "x/y",
            locale: "ja-JP",
            source: 'other {are # files}'
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralTranslationsNonPlural: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "fr-FR",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'Maximum custodians',
                targetLocale: "fr-FR",
                target: "Depositaires maximaux",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralTranslationsNonPluralWithOtherFormatjsStuff: function(test) {
        test.expect(2);

        const rule = new ResourceICUPluralTranslation();
        test.ok(rule);

        const actual = rule.match({
            locale: "fr-FR",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: 'Maximum {max} custodians',
                targetLocale: "fr-FR",
                target: "Depositaires maximaux {max}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },
};


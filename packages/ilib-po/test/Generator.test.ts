/*
 * Generator.test.ts - test the po file generator object.
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

import { ResourceString, ResourcePlural, ResourceArray, TranslationSet } from "ilib-tools-common";

import Generator from "../src/Generator";

describe("generator", () => {
    test("Generator constructor no args", () => {
        expect.assertions(1);

        expect(() => {
            // @ts-expect-error -- testing invalid args
            const generator = new Generator(undefined);
        }).toThrow();
    });

    test("Generator generate simple text", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text multiple", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with plural resources", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "string 1",
            source: {
                one: "string 1",
                other: "strings 1"
            },
            sourceLocale: "en-US",
            target: {
                one: "chaîne 1",
                other: "chaînes 1"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);

        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            "msgid \"string 1\"\n" +
            "msgid_plural \"strings 1\"\n" +
            "msgstr[0] \"chaîne 1\"\n" +
            "msgstr[1] \"chaînes 1\"\n";
        expect(actual).toBe(expected);
    });

    test("Generator generate text with array resources", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceArray({
            project: "foo",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "po",
            comment: JSON.stringify({
                translator: ["note for translators"],
                extracted: ["extracted comment"],
                paths: ["src/a/b/c.js:32"],
                flags: ["c-format"]
            })
        }));

        const actual = generator.generate(translations);

        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            '# note for translators\n' +
            '#. extracted comment\n' +
            '#: src/a/b/c.js:32\n' +
            '#, c-format\n' +
            '#k foo\n' +
            '## 0\n' +
            "msgid \"string 1\"\n" +
            "msgstr \"chaîne 1\"\n" +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            "msgid \"string 2\"\n" +
            'msgstr "chaîne 2"\n'
        expect(actual).toBe(expected);
    });

    test("Generator generate text while preserving comments", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po",
            comment: JSON.stringify({
                translator: ["note for translators"],
                extracted: ["extracted comment"],
                paths: ["src/a/b/c.js:32"],
                flags: ["c-format"]
            })
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators\n' +
            '#. extracted comment\n' +
            '#: src/a/b/c.js:32\n' +
            '#, c-format\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text while preserving multiple comments", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po",
            comment: JSON.stringify({
                translator: ["note for translators 1", "note for translators 2"],
                extracted: ["extracted comment 1", "extracted comment 2"],
                paths: ["src/a/b/c.js:32", "src/a/b/x.js:32"],
                flags: ["c-format", "javascript-format"],
                previous: ["str2", "string2"]
            })
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators 1\n' +
            '# note for translators 2\n' +
            '#. extracted comment 1\n' +
            '#. extracted comment 2\n' +
            '#: src/a/b/c.js:32\n' +
            '#: src/a/b/x.js:32\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str2\n' +
            '#| string2\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with escaped quotes", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'string "quoted" 1',
            source: "string 1",
            sourceLocale: "en-US",
            target: 'chaîne "numéro" 1',
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string \\"quoted\\" 1"\n' +
            'msgstr "chaîne \\"numéro\\" 1"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with context", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            context: "context 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1 contexte 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            context: "context 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2 contexte 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1 contexte 1"\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 2 contexte 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with context in key", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/context.po",
            targetLocale: "fr-FR",
            contextInKey: true
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1 --- context 1",
            source: "string 1",
            sourceLocale: "en-US",
            context: "context 1",
            target: "chaîne numéro 1 contexte 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1 --- context 2",
            source: "string 1",
            sourceLocale: "en-US",
            context: "context 2",
            target: "chaîne numéro 2 contexte 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/context.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgctxt "context 1"\n' +
            'msgid "string 1 --- context 1"\n' +
            'msgstr "chaîne numéro 1 contexte 1"\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1 --- context 2"\n' +
            'msgstr "chaîne numéro 2 contexte 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with no actual translation", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "string 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "string 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text plurals with no actual translation", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} object",
            source: {
                one: "{$count} object",
                other: "{$count} objects"
            },
            sourceLocale: "en-US",
            target: {
                one: "{$count} object",
                other: "{$count} objects"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} item",
            source: {
                one: "{$count} item",
                other: "{$count} items"
            },
            sourceLocale: "en-US",
            target: {
                one: "{$count} item",
                other: "{$count} items"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "{$count} object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            '\n' +
            'msgid "{$count} item"\n' +
            'msgid_plural "{$count} items"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text plurals with translations", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} object",
            source: {
                one: "{$count} object",
                other: "{$count} objects"
            },
            sourceLocale: "en-US",
            target: {
                one: "{$count} objet",
                other: "{$count} objets"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} item",
            source: {
                one: "{$count} item",
                other: "{$count} items"
            },
            sourceLocale: "en-US",
            target: {
                one: "{$count} chose",
                other: "{$count} choses"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "{$count} object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "{$count} objet"\n' +
            'msgstr[1] "{$count} objets"\n' +
            '\n' +
            'msgid "{$count} item"\n' +
            'msgid_plural "{$count} items"\n' +
            'msgstr[0] "{$count} chose"\n' +
            'msgstr[1] "{$count} choses"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate a file for a language that has extra plural categories", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "ru-RU",
            contextInKey: false
        });
        expect(generator).toBeTruthy();

        const set = new TranslationSet();
        set.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        set.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        set.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        set.add(new ResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        const actual = generator.generate(set);

        const expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru-RU\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "строка 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "строка 2"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} струна"\n' +
            'msgstr[1] "{$count} струны"\n' +
            'msgstr[2] "{$count} струн"\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "строка 3 и 4"\n';

        expect(actual).toBe(expected);
    });
});

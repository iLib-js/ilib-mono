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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate simple text with a key that is different than the source string", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "asdf",
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#k asdf\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text multiple", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            "msgid \"string 1\"\n" +
            "msgid_plural \"strings 1\"\n" +
            "msgstr[0] \"chaîne 1\"\n" +
            "msgstr[1] \"chaînes 1\"\n";
        expect(actual).toBe(expected);
    });

    test("Generator generate text with plural resources that have a key that is different than the singular string", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "asdf",
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#k asdf\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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

    test("Generator generate text while preserving multiple comments", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
                extracted: ["extracted comment 1 first line\nand second line", "extracted comment 2 first line\nand second line"],
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators 1\n' +
            '# note for translators 2\n' +
            '#. extracted comment 1 first line\n' +
            '#. and second line\n' +
            '#. extracted comment 2 first line\n' +
            '#. and second line\n' +
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

    test("Generator generate text where the path is not in the comments yet", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            datatype: "po",
            pathName: "src/a/b/c.js"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po",
            pathName: "src/a/b/x.js",
            comment: JSON.stringify({
                translator: ["note for translators 1", "note for translators 2"],
                extracted: ["extracted comment 1", "extracted comment 2"],
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#: src/a/b/c.js\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators 1\n' +
            '# note for translators 2\n' +
            '#. extracted comment 1\n' +
            '#. extracted comment 2\n' +
            '#: src/a/b/x.js\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });
        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'string "quoted" 1',
            source: 'string "quoted" 1',
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: true,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#k string 1 --- context 1\n' +
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1 contexte 1"\n' +
            '\n' +
            '#k string 1 --- context 2\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 2 contexte 2"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with no actual translation", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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

    test("Generator generates empty plural translations for Polish with correct number of categories", () => {
        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "pl-PL",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "Your item",
            source: {
                one: "Your item",
                other: "Selected items"
            },
            sourceLocale: "en-US",
            target: {
                one: "Your item",
                few: "Selected items",
                many: "Selected items",
                other: "Selected items",
            },
            targetLocale: "pl-PL",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid "Your item"\n' +
            'msgid_plural "Selected items"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            'msgstr[2] ""\n';

        expect(actual).toContain(expected);
    });

    test("Generator generates correct plural translations for Polish with all plural forms except 'other' populated", () => {
        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "pl-PL",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "Your item",
            source: {
                one: "Your item",
                other: "Selected items"
            },
            sourceLocale: "en-US",
            target: {
                one: "ONE Twój element",
                few: "FEW Wybrane elementy",
                many: "MANY Wybrane elementy",
                other: "OTHER Wybrane elementy"
            },
            targetLocale: "pl-PL",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid "Your item"\n' +
            'msgid_plural "Selected items"\n' +
            'msgstr[0] "ONE Twój element"\n' +
            'msgstr[1] "FEW Wybrane elementy"\n' +
            'msgstr[2] "MANY Wybrane elementy"\n';

        expect(actual).toContain(expected);
        expect(actual).not.toContain("OTHER Wybrane elementy")
    });

    test("Generator generates a file with both singular and plural entries for Polish with all plural forms except 'other'", () => {
        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "pl-PL",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "słowo 1",
            targetLocale: "pl-PL",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} słowo",
                "few": "{$count} słowa",
                "many": "{$count} słów",
                "other": "{$count} OTHER słowa"
            },
            targetLocale: "pl-PL",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgid "string 1"\n' +
            'msgstr "słowo 1"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} słowo"\n' +
            'msgstr[1] "{$count} słowa"\n' +
            'msgstr[2] "{$count} słów"\n';

        expect(actual).toContain(expected);
        expect(actual).not.toContain("{$count} OTHER słowa");
    });

    test("Generator backfills 'many' with 'other' for Polish when 'many' is missing in incoming Resource object", () => {
        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "pl-PL",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
        });

        const translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "Your item",
            source: {
                one: "Your item",
                other: "Selected items"
            },
            sourceLocale: "en-US",
            target: {
                one: "ONE",
                few: "FEW",
                other: "OTHER - should be used as a backfill for MANY"
            },
            targetLocale: "pl-PL",
            datatype: "po"
        }));

        const actual = generator.generate(translations);
        const expected =
            'msgstr[0] "ONE"\n' +
            'msgstr[1] "FEW"\n' +
            'msgstr[2] "OTHER - should be used as a backfill for MANY"\n';

        expect(actual).toContain(expected);
    });

    test("Generator generate text plurals with translations", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
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

    test("Generator generate text with different datatypes", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            datatype: "json"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "python"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} chaîne",
                "other": "{$count} chaînes"
            },
            targetLocale: "fr-FR",
            datatype: "javascript"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#d json\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '#d python\n' +
            '#k foo\n' +
            '## 0\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            '#d javascript\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} chaîne"\n' +
            'msgstr[1] "{$count} chaînes"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with different datatypes, some of which are the same as the default datatype", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "foo"
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
            datatype: "json"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} chaîne",
                "other": "{$count} chaînes"
            },
            targetLocale: "fr-FR",
            datatype: "javascript"
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
            '"Data-Type: po\\n"\n' +
            '"Project: foo\\n"\n' +
            '\n' +
            '#d json\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 0\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            '#d javascript\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} chaîne"\n' +
            'msgstr[1] "{$count} chaînes"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with different projects", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "manhattan"
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
        translations.add(new ResourceArray({
            project: "bar",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "asdf",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} chaîne",
                "other": "{$count} chaînes"
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
            '"Data-Type: po\\n"\n' +
            '"Project: manhattan\\n"\n' +
            '\n' +
            '#p foo\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '#p bar\n' +
            '#k foo\n' +
            '## 0\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            '#p asdf\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} chaîne"\n' +
            'msgstr[1] "{$count} chaînes"\n';

        expect(actual).toBe(expected);
    });

    test("Generator generate text with different project names, some of which are the same as the default project name", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po",
            projectName: "manhattan"
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
        translations.add(new ResourceArray({
            project: "bar",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "manhattan",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} chaîne",
                "other": "{$count} chaînes"
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
            '"Data-Type: po\\n"\n' +
            '"Project: manhattan\\n"\n' +
            '\n' +
            '#p foo\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '#p bar\n' +
            '#k foo\n' +
            '## 0\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} chaîne"\n' +
            'msgstr[1] "{$count} chaînes"\n';

        expect(actual).toBe(expected);
    });

        test("Generator generate text with default project", () => {
        expect.assertions(2);

        const generator = new Generator({
            pathName: "./po/messages.po",
            targetLocale: "fr-FR",
            contextInKey: false,
            datatype: "po"
        });

        expect(generator).toBeTruthy();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "default",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceArray({
            project: "default",
            key: "foo",
            source: ["string 1", "string 2"],
            sourceLocale: "en-US",
            target: ["chaîne 1", "chaîne 2"],
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "default",
            key: "one string",
            source: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            target: {
                "one": "{$count} chaîne",
                "other": "{$count} chaînes"
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
            '"Data-Type: po\\n"\n' +
            '"Project: default\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 0\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '#k foo\n' +
            '## 1\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} chaîne"\n' +
            'msgstr[1] "{$count} chaînes"\n';

        expect(actual).toBe(expected);
    });
});

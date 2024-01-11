/*
 * OpenAPIFile.test.js - Represents a collection of json files
 *
 * Copyright © 2021, 2023 Box, Inc.
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

var path = require('path');
var fs = require('fs');

if (!OpenAPIFile) {
    var OpenAPIFile = require('../OpenAPIFile');
    var OpenAPIFileType = require('../OpenAPIFileType');
    var JsonFileType = require('ilib-loctool-json/JsonFileType');

    var CustomProject = require('loctool/lib/CustomProject.js');
    var TranslationSet = require('loctool/lib/TranslationSet.js');
    var ResourceString = require('loctool/lib/ResourceString.js');
    var ResourceArray = require('loctool/lib/ResourceArray');
    var ResourcePlural = require('loctool/lib/ResourcePlural');
}

var p = new CustomProject({
    name: 'foo',
    id: 'foo',
    sourceLocale: 'en-US'
}, './test/testfiles', {
    locales: ['ru-RU'],
    targetDir: '.',
    nopseudo: true,
    openapi: {
        schemas: ['./test/testfiles/custom-schema.json'],
        mappings: {
            '**/openapi.json': {
                schema: 'openapi-schema',
                method: 'copy',
                template: 'resources/[localeDir]/openapi.json'
            },
            '**/openapi-empty-objs.json': {
                schema: 'openapi-schema',
                method: 'copy',
                template: 'resources/[localeDir]/openapi-empty-objs.json'
            },
            '**/custom.json': {
                schema: 'custom-schema',
                method: 'copy',
                template: 'resources/[localeDir]/custom.json'
            },
            '**/plural-json.json': {
                schema: 'custom-schema',
                method: 'copy',
                template: 'resources/[localeDir]/plural.json'
            }
        }
    }
});

var t = new OpenAPIFileType(p);

describe("openapifile", function() {
    describe("constuctor", function() {
        test("Constructor", function() {
            expect.assertions(1);

            var oaf = new OpenAPIFile({
                project: p,
                jsonFileType: t.jsonFileType,
                markdownFileType: t.markdownFileType
            });

            expect(oaf).toBeTruthy();
        });

        test("ConstructorUseTypeToGetRequiredParam", function() {
            expect.assertions(1);

            var oaf = new OpenAPIFile({
                project: p,
                type: t
            });

            expect(oaf).toBeTruthy();
        });

        test("ConstructorParams", function() {
            expect.assertions(1);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: './testfiles/json/messages.json'
            });

            expect(oaf).toBeTruthy();
        });

        test("ConstructorErrorMissingRequiredParam", function() {
            expect.assertions(1);

            expect(function(test) {
                var oaf = new OpenAPIFile({
                    project: p
                });
            }).toThrow();
        });
    });

    describe("parse", function() {
        test("ParseSimpleJsonGetBySource", function() {
            expect.assertions(5);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "openapi": "3.0.0",\n' +
                '  "info": {\n' +
                '    "title": "Test OpenAPI File",\n' +
                '    "description": "File used for testing OpenAPI parser",\n' +
                '    "version": "1.0.0"\n' +
                '  }\n' +
                '}';
            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resource = set.getBySource('File used for testing OpenAPI parser');
            expect(resource).toBeTruthy();

            expect(resource.getSource()).toBe('File used for testing OpenAPI parser');
            expect(resource.getKey()).toBe(oaf.markdownFile.makeKey('File used for testing OpenAPI parser'));
        });

        test("ParseMarkdownJsonGetBySource", function() {
            expect.assertions(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "summary": "Test path with markdown",\n' +
                '        "description": "Markdown string with `code` in it"\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}';
            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resource = set.getBySource('Markdown string with <c0/> in it');
            expect(resource).toBeTruthy();

            expect(resource.getSource()).toBe('Markdown string with <c0/> in it');
            expect(resource.getComment()).toBe('c0 will be replaced with the inline code `code`.');
            expect(resource.getKey()).toBe(oaf.makeKey('Markdown string with <c0/> in it'));
            expect(resource.getDataType()).toBe('markdown');
        });

        test("ParseInlineCodeOnlyString", function() {
            expect.assertions(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "responses": {\n' +
                '          "200": {\n' +
                '            "description": "`code only string`"\n' +
                '          },\n' +
                '          "404": {\n' +
                '            "description": "String with no parameters"\n' +
                '          }\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}';
            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resources = set.getAll();
            expect(resources.length).toBe(2);
            expect(resources[0].getSource()).toBe('Markdown string with <c0/> in it');
            expect(resources[0].getComment()).toBe('c0 will be replaced with the inline code `code`.');

            expect(resources[1].getSource()).toBe('String with no parameters');
            expect(resources[1].getComment()).toBeUndefined();
        });

        test("ParseDoubleNewLine", function() {
            expect.assertions(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "responses": {\n' +
                '          "404": {\n' +
                '            "description": "Not Found\\n\\nresponse with `markdown` break line"\n' +
                '          }\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}';
            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resources = set.getAll();
            expect(resources.length).toBe(2);
            expect(resources[0].getSource()).toBe('Not Found');
            expect(resources[0].getComment()).toBeUndefined();

            expect(resources[1].getSource()).toBe('response with <c0/> break line');
            expect(resources[1].getComment()).toBe('c0 will be replaced with the inline code `markdown`.');
        });

        test("ParseCustomSchema", function() {
            expect.assertions(5);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "summary": "this is a test summary",\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "additionalField": "Translatable field using `custom` schema"\n' +
                '      }\n' +
                '    },\n' +
                '    "/ignored": {\n' +
                '      "post": {\n' +
                '        "summary": "this is a test summary",\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "additionalField": "Path ignored"\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}\n';

            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resources = set.getAll();
            expect(resources.length).toBe(1);
            expect(resources[0].getSource()).toBe('Translatable field using <c0/> schema');
            expect(resources[0].getComment()).toBe('c0 will be replaced with the inline code `custom`.');
        });

        test("ParseArrayJson", function() {
            expect.assertions(13);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/array": {\n' +
                '      "get": {\n' +
                '        "description": "Test array support using tags",\n' +
                '        "tags": [\n' +
                '          "First Tag",\n' +
                '          "Second Tag",\n' +
                '          "Third Tag"\n' +
                '        ],\n' +
                '        "responses": {\n' +
                '          "200": {\n' +
                '            "description": "OK Response"\n' +
                '          }\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}';

            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resources = set.getAll();
            expect(resources.length).toBe(3);
            expect(resources[0].getSource()).toBe('Test array support using tags');

            expect(resources[1].getType()).toBe('array');
            expect(resources[1].getKey()).toBe('paths//array/get/tags');
            expect(resources[1].getDataType()).toBe('json');

            var arrayStrings = resources[1].getSourceArray();
            expect(arrayStrings).toBeTruthy();

            expect(arrayStrings.length).toBe(3);
            expect(arrayStrings[0]).toBe('First Tag');
            expect(arrayStrings[1]).toBe('Second Tag');
            expect(arrayStrings[2]).toBe('Third Tag');

            expect(resources[2].getSource()).toBe('OK Response');

        });

        test("ParsePluralJson", function() {
            expect.assertions(16);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });
            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "summary": "Test path with markdown",\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "additionalField": "Translatable field using `custom` schema",\n' +
                '      }\n' +
                '    },\n' +
                '    "/plural": {\n' +
                '      "get": {\n' +
                '        "description": "Test plural support",\n' +
                '        "pluralProp": {\n' +
                '          "one": "singular",\n' +
                '          "many": "many",\n' +
                '          "other": "plural"\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}\n';

            oaf.parse(jsonToParse);

            var set = oaf.getTranslationSet();
            expect(set).toBeTruthy();

            var resources = set.getAll();
            expect(resources.length).toBe(2);
            expect(resources[0].getSource()).toBe('Translatable field using <c0/> schema');
            expect(resources[0].getComment()).toBe('c0 will be replaced with the inline code `custom`.');
            expect(resources[0].getDataType()).toBe('markdown');

            expect(resources[1].getType()).toBe('plural');
            expect(resources[1].getKey()).toBe('paths//plural/get/pluralProp');
            expect(resources[1].getDataType()).toBe('json');

            var pluralStrings = resources[1].getSourcePlurals();
            expect(pluralStrings).toBeTruthy();

            expect(pluralStrings.one).toBe('singular');
            expect(pluralStrings.many).toBe('many');
            expect(pluralStrings.other).toBe('plural');
            expect(!pluralStrings.zero).toBeTruthy();
            expect(!pluralStrings.two).toBeTruthy();
            expect(!pluralStrings.few).toBeTruthy();
        });
    });

    describe("localizeText", function() {
        test("LocalizeTextSimpleJson", function() {
            expect.assertions(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });

            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "openapi": "3.0.0",\n' +
                '  "info": {\n' +
                '    "title": "Test OpenAPI File",\n' +
                '    "description": "File used for testing OpenAPI parser",\n' +
                '    "version": "1.0.0"\n' +
                '  }\n' +
                '}\n';
            oaf.parse(jsonToParse);

            var translations = new TranslationSet();
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('File used for testing OpenAPI parser'),
                source: 'This is a test description',
                sourceLocale: 'en-US',
                target: 'Файл используется для тестирования OpenAPI парсера',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));

            var actual = oaf.localizeText(translations, 'ru-RU');
            var expected = '{\n' +
                '    "openapi": "3.0.0",\n' +
                '    "info": {\n' +
                '        "title": "Test OpenAPI File",\n' +
                '        "description": "Файл используется для тестирования OpenAPI парсера",\n' +
                '        "version": "1.0.0"\n' +
                '    }\n' +
                '}\n';

            expect(actual).toBe(expected);
        });

        test("LocalizeTextMarkdownJson", function() {
            expect.assertions(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });

            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "summary": "this is a test summary",\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "additionalField": "Non-translatable field"\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}\n';

            oaf.parse(jsonToParse);

            var translations = new TranslationSet();
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Markdown string with <c0/> in it'),
                source: 'Markdown string with <c0/> in it',
                sourceLocale: 'en-US',
                target: 'Markdown строка с <c0/> в ней',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('this is a test summary'),
                source: 'this is a test summary',
                sourceLocale: 'en-US',
                target: 'это тестовая сводка',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));

            var actual = oaf.localizeText(translations, 'ru-RU');
            var expected = '{\n' +
                '    "paths": {\n' +
                '        "/markdown": {\n' +
                '            "post": {\n' +
                '                "summary": "это тестовая сводка",\n' +
                '                "description": "Markdown строка с `code` в ней",\n' +
                '                "additionalField": "Non-translatable field"\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '}\n';

            expect(actual).toBe(expected);
        });

        test("LocalizeTextComplexJson", function() {
            expect.assertions(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });

            expect(oaf).toBeTruthy();

            var jsonToParse = '{\n' +
                '  "paths": {\n' +
                '    "/markdown": {\n' +
                '      "post": {\n' +
                '        "summary": "this is a test summary",\n' +
                '        "description": "Markdown string with `code` in it",\n' +
                '        "tags": [\n' +
                '            "Test Tag",\n' +
                '            "Another Tag"\n' +
                '        ],\n' +
                '        "additionalField": "Non-translatable field"\n' +
                '      }\n' +
                '    },\n' +
                '    "/plural": {\n' +
                '      "get": {\n' +
                '        "description": "Test plural support",\n' +
                '        "pluralProp": {\n' +
                '          "one": "singular",\n' +
                '          "many": "many",\n' +
                '          "other": "plural"\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}\n';



            oaf.parse(jsonToParse);

            var translations = new TranslationSet();
            translations.add(new ResourceArray({
                project: 'foo',
                key: 'paths//markdown/post/tags',
                sourceArray: [
                    'Test Tag',
                    'Another Tag'
                ],
                sourceLocale: 'en-US',
                targetArray: [
                    'Тестовый Тэг',
                    'Другой Тэг'
                ],
                targetLocale: 'ru-RU',
                datatype: 'json'
            }));
            translations.add(new ResourcePlural({
                project: 'foo',
                key: 'paths//plural/get/pluralProp',
                sourceStrings: {
                    'one': 'singular',
                    'many': 'many',
                    'other': 'plural'
                },
                sourceLocale: 'en-US',
                targetStrings: {
                    'one': 'единственное число',
                    'many': 'много',
                    'other': 'другое'
                },
                targetLocale: 'ru-RU',
                datatype: 'json'
            }));

            var actual = oaf.localizeText(translations, 'ru-RU');

            var expected = '{\n' +
                '    "paths": {\n' +
                '        "/markdown": {\n' +
                '            "post": {\n' +
                '                "summary": "this is a test summary",\n' +
                '                "description": "Markdown string with `code` in it",\n' +
                '                "tags": [\n' +
                '                    "Тестовый Тэг",\n' +
                '                    "Другой Тэг"\n' +
                '                ],\n' +
                '                "additionalField": "Non-translatable field"\n' +
                '            }\n' +
                '        },\n' +
                '        "/plural": {\n' +
                '            "get": {\n' +
                '                "description": "Test plural support",\n' +
                '                "pluralProp": {\n' +
                '                    "one": "единственное число",\n' +
                '                    "many": "много",\n' +
                '                    "other": "другое"\n' +
                '                }\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '}\n'

            expect(actual).toBe(expected);
        });
    });

    describe("localize", function() {
        test("Localize a file", function() {
            expect.assertions(4);

            var base = path.dirname(module.id);
            if (fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'))) {
                fs.unlinkSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'));
            }

            expect(!fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'))).toBeTruthy();

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: './openapi.json'
            });

            expect(oaf).toBeTruthy();

            oaf.extract();

            var translations = new TranslationSet();
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('File used for testing OpenAPI parser'),
                source: 'This is a test description',
                sourceLocale: 'en-US',
                target: 'Файл используется для тестирования OpenAPI парсера',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('OpenAPI docs'),
                source: 'OpenAPI docs',
                sourceLocale: 'en-US',
                target: 'OpenAPI документация',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Test path without markdown'),
                source: 'Test path without markdown',
                sourceLocale: 'en-US',
                target: 'Тестовый путь без markdown',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceArray({
                project: 'foo',
                key: 'paths//json/get/tags',
                sourceArray: [
                    'First Tag',
                    'Second Tag',
                    'Third Tag'
                ],
                sourceLocale: 'en-US',
                targetArray: [
                    'Первый Тэг',
                    'Второй Тэг',
                    'Третий Тэг'
                ],
                targetLocale: 'ru-RU',
                datatype: 'json'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Param parsing'),
                source: 'Param parsing',
                sourceLocale: 'en-US',
                target: 'Парсинг параметров',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('OK Response'),
                source: 'OK Response',
                sourceLocale: 'en-US',
                target: 'ОК Ответ',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Markdown string with <c0/> in it'),
                source: 'Markdown string with <c0/> in it',
                sourceLocale: 'en-US',
                target: 'Markdown строка с <c0/> в ней',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Not Found'),
                source: 'Not Found',
                sourceLocale: 'en-US',
                target: 'Не Найдено',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));

            oaf.localize(translations, ['ru-RU']);
            expect(fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'))).toBeTruthy();

            var content = fs.readFileSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'), 'utf-8');

            var expected = '{\n' +
                '    "openapi": "3.0.0",\n' +
                '    "info": {\n' +
                '        "title": "Test OpenAPI File",\n' +
                '        "description": "Файл используется для тестирования OpenAPI парсера",\n' +
                '        "version": "1.0.0"\n' +
                '    },\n' +
                '    "servers": [\n' +
                '        {\n' +
                '            "url": "https://swagger.io/specification/",\n' +
                '            "description": "OpenAPI документация"\n' +
                '        }\n' +
                '    ],\n' +
                '    "paths": {\n' +
                '        "/json": {\n' +
                '            "get": {\n' +
                '                "summary": "Тестовый путь без markdown",\n' +
                '                "description": "Test path to verify simple json parser",\n' +
                '                "tags": [\n' +
                '                    "Первый Тэг",\n'+
                '                    "Второй Тэг",\n'+
                '                    "Третий Тэг"\n'+
                '                ],\n' +
                '                "parameters": [\n' +
                '                    {\n' +
                '                        "name": "testParam",\n' +
                '                        "in": "query",\n' +
                '                        "description": "Парсинг параметров"\n' +
                '                    }\n' +
                '                ],\n' +
                '                "responses": {\n' +
                '                    "200": {\n' +
                '                        "description": "ОК Ответ"\n' +
                '                    }\n' +
                '                }\n' +
                '            }\n' +
                '        },\n' +
                '        "/markdown": {\n' +
                '            "post": {\n' +
                '                "summary": "Test path with markdown",\n' +
                '                "description": "Markdown строка с `code` в ней",\n' +
                '                "responses": {\n' +
                '                    "200": {\n' +
                '                        "description": "`code only string`"\n' +
                '                    },\n' +
                '                    "404": {\n' +
                '                        "description": "Не Найдено\\n\\nresponse with markdown break line"\n' +
                '                    }\n' +
                '                }\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '}\n';

            expect(content).toBe(expected);
        });

        test("Localize a file with empty objects in it", function() {
            expect.assertions(4);

            var base = path.dirname(module.id);
            if (fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi-empty-objs.json'))) {
                fs.unlinkSync(path.join(base, 'testfiles/resources/ru/RU/openapi-empty-objs.json'));
            }

            expect(!fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi-empty-objs.json'))).toBeTruthy();

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: './openapi-empty-objs.json'
            });

            expect(oaf).toBeTruthy();

            oaf.extract();

            var translations = new TranslationSet();
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('File used for testing OpenAPI parser'),
                source: 'This is a test description',
                sourceLocale: 'en-US',
                target: 'Файл используется для тестирования OpenAPI парсера',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('OpenAPI docs'),
                source: 'OpenAPI docs',
                sourceLocale: 'en-US',
                target: 'OpenAPI документация',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Test path without markdown'),
                source: 'Test path without markdown',
                sourceLocale: 'en-US',
                target: 'Тестовый путь без markdown',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceArray({
                project: 'foo',
                key: 'paths//json/get/tags',
                sourceArray: [
                    'First Tag',
                    'Second Tag',
                    'Third Tag'
                ],
                sourceLocale: 'en-US',
                targetArray: [
                    'Первый Тэг',
                    'Второй Тэг',
                    'Третий Тэг'
                ],
                targetLocale: 'ru-RU',
                datatype: 'json'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Param parsing'),
                source: 'Param parsing',
                sourceLocale: 'en-US',
                target: 'Парсинг параметров',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('OK Response'),
                source: 'OK Response',
                sourceLocale: 'en-US',
                target: 'ОК Ответ',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Markdown string with <c0/> in it'),
                source: 'Markdown string with <c0/> in it',
                sourceLocale: 'en-US',
                target: 'Markdown строка с <c0/> в ней',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));
            translations.add(new ResourceString({
                project: 'foo',
                key: oaf.makeKey('Not Found'),
                source: 'Not Found',
                sourceLocale: 'en-US',
                target: 'Не Найдено',
                targetLocale: 'ru-RU',
                datatype: 'markdown'
            }));

            oaf.localize(translations, ['ru-RU']);
            expect(fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi-empty-objs.json'))).toBeTruthy();

            var content = fs.readFileSync(path.join(base, 'testfiles/resources/ru/RU/openapi-empty-objs.json'), 'utf-8');

            var expected = '{\n' +
                '    "openapi": "3.0.0",\n' +
                '    "info": {\n' +
                '        "title": "Test OpenAPI File",\n' +
                '        "description": "Файл используется для тестирования OpenAPI парсера",\n' +
                '        "version": "1.0.0"\n' +
                '    },\n' +
                '    "servers": [\n' +
                '        {\n' +
                '            "url": "https://swagger.io/specification/",\n' +
                '            "description": "OpenAPI документация"\n' +
                '        }\n' +
                '    ],\n' +
                '    "paths": {\n' +
                '        "/json": {\n' +
                '            "get": {\n' +
                '                "summary": "Тестовый путь без markdown",\n' +
                '                "description": "Test path to verify simple json parser",\n' +
                '                "tags": [\n' +
                '                    "Первый Тэг",\n'+
                '                    "Второй Тэг",\n'+
                '                    "Третий Тэг"\n'+
                '                ],\n' +
                '                "parameters": [\n' +
                '                    {},\n' +
                '                    {\n' +
                '                        "name": "testParam",\n' +
                '                        "in": "query",\n' +
                '                        "description": "Парсинг параметров"\n' +
                '                    }\n' +
                '                ],\n' +
                '                "responses": {\n' +
                '                    "200": {\n' +
                '                        "description": "ОК Ответ"\n' +
                '                    }\n' +
                '                },\n' +
                '                "nonlocalized": {\n' +
                '                    "test": {}\n' +
                '                }\n' +
                '            }\n' +
                '        },\n' +
                '        "/markdown": {\n' +
                '            "post": {\n' +
                '                "summary": "Test path with markdown",\n' +
                '                "description": "Markdown строка с `code` в ней",\n' +
                '                "responses": {\n' +
                '                    "200": {\n' +
                '                        "description": "`code only string`"\n' +
                '                    },\n' +
                '                    "404": {\n' +
                '                        "description": "Не Найдено\\n\\nresponse with markdown break line"\n' +
                '                    }\n' +
                '                }\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '}\n';

            expect(content).toBe(expected);
        });
    });
});

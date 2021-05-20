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

module.exports.openapifile = {
    constuctor: {
        testConstructor: function(test) {
            test.expect(1);

            var oaf = new OpenAPIFile({
                project: p,
                jsonFileType: t.jsonFileType,
                markdownFileType: t.markdownFileType
            });

            test.ok(oaf);

            test.done();
        },

        testConstructorUseTypeToGetRequiredParam: function(test) {
            test.expect(1);

            var oaf = new OpenAPIFile({
                project: p,
                type: t
            });

            test.ok(oaf);

            test.done();
        },

        testConstructorParams: function(test) {
            test.expect(1);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: './testfiles/json/messages.json'
            });

            test.ok(oaf);

            test.done();
        },

        testConstructorErrorMissingRequiredParam: function(test) {
            test.expect(1);

            test.throws(function(test) {
                var oaf = new OpenAPIFile({
                    project: p
                });
            });

            test.done();
        }
    },

    parse: {
        testParseSimpleJsonGetBySource: function(test) {
            test.expect(5);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resource = set.getBySource('File used for testing OpenAPI parser');
            test.ok(resource);

            test.equal(resource.getSource(), 'File used for testing OpenAPI parser');
            test.equal(resource.getKey(), oaf.markdownFile.makeKey('File used for testing OpenAPI parser'));

            test.done();
        },

        testParseMarkdownJsonGetBySource: function(test) {
            test.expect(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resource = set.getBySource('Markdown string with <c0/> in it');
            test.ok(resource);

            test.equal(resource.getSource(), 'Markdown string with <c0/> in it');
            test.equal(resource.getComment(), 'c0 will be replaced with the inline code `code`.');
            test.equal(resource.getKey(), oaf.makeKey('Markdown string with <c0/> in it'));
            test.equal(resource.getDataType(), 'markdown');

            test.done();
        },

        testParseInlineCodeOnlyString: function(test) {
            test.expect(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resources = set.getAll();
            test.equal(resources.length, 2);
            test.equal(resources[0].getSource(), 'Markdown string with <c0/> in it');
            test.equal(resources[0].getComment(), 'c0 will be replaced with the inline code `code`.');

            test.equal(resources[1].getSource(), 'String with no parameters');
            test.equal(resources[1].getComment(), null);

            test.done();
        },

        testParseDoubleNewLine: function(test) {
            test.expect(7);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resources = set.getAll();
            test.equal(resources.length, 2);
            test.equal(resources[0].getSource(), 'Not Found');
            test.equal(resources[0].getComment(), null);

            test.equal(resources[1].getSource(), 'response with <c0/> break line');
            test.equal(resources[1].getComment(), 'c0 will be replaced with the inline code `markdown`.');

            test.done();
        },

        testParseCustomSchema: function(test) {
            test.expect(5);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resources = set.getAll();
            test.equal(resources.length, 1);
            test.equal(resources[0].getSource(), 'Translatable field using <c0/> schema');
            test.equal(resources[0].getComment(), 'c0 will be replaced with the inline code `custom`.');

            test.done();
        },

        testParseArrayJson: function(test) {
            test.expect(13);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resources = set.getAll();
            test.equal(resources.length, 3);
            test.equal(resources[0].getSource(), 'Test array support using tags');

            test.equal(resources[1].getType(), 'array');
            test.equal(resources[1].getKey(), 'paths//array/get/tags');
            test.equal(resources[1].getDataType(), 'json');

            var arrayStrings = resources[1].getSourceArray();
            test.ok(arrayStrings);

            test.equal(arrayStrings.length, 3);
            test.equals(arrayStrings[0], 'First Tag');
            test.equals(arrayStrings[1], 'Second Tag');
            test.equals(arrayStrings[2], 'Third Tag');

            test.equal(resources[2].getSource(), 'OK Response');

            test.done();

        },

        testParsePluralJson: function(test) {
            test.expect(16);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });
            test.ok(oaf);

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
            test.ok(set);

            var resources = set.getAll();
            test.equal(resources.length, 2);
            test.equal(resources[0].getSource(), 'Translatable field using <c0/> schema');
            test.equal(resources[0].getComment(), 'c0 will be replaced with the inline code `custom`.');
            test.equal(resources[0].getDataType(), 'markdown');

            test.equal(resources[1].getType(), 'plural');
            test.equal(resources[1].getKey(), 'paths//plural/get/pluralProp');
            test.equal(resources[1].getDataType(), 'json');

            var pluralStrings = resources[1].getSourcePlurals();
            test.ok(pluralStrings);

            test.equal(pluralStrings.one, 'singular');
            test.equal(pluralStrings.many, 'many');
            test.equal(pluralStrings.other, 'plural');
            test.ok(!pluralStrings.zero);
            test.ok(!pluralStrings.two);
            test.ok(!pluralStrings.few);

            test.done();
        }
    },

    localizeText: {
        testLocalizeTextSimpleJson: function(test) {
            test.expect(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });

            test.ok(oaf);

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

            test.equal(actual, expected);

            test.done();
        },

        testLocalizeTextMarkdownJson: function(test) {
            test.expect(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/openapi.json'
            });

            test.ok(oaf);

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

            test.equal(actual, expected);

            test.done();
        },

        testLocalizeTextComplexJson: function(test) {
            test.expect(2);

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: 'i18n/custom.json'
            });

            test.ok(oaf);

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

            test.equal(actual, expected);

            test.done();
        }
    },

    localize: {
        testLocalize: function(test) {
            test.expect(4);

            var base = path.dirname(module.id);
            if (fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'))) {
                fs.unlinkSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json'));
            }

            test.ok(!fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json')));

            var oaf = new OpenAPIFile({
                project: p,
                type: t,
                pathName: './openapi.json'
            });

            test.ok(oaf);

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
            test.ok(fs.existsSync(path.join(base, 'testfiles/resources/ru/RU/openapi.json')));

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

            test.equal(content, expected);

            test.done();
        }
    }
}

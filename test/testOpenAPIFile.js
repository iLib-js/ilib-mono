var path = require("path");
var fs = require("fs");

if (!OpenAPIFile) {
	var OpenAPIFile = require("../OpenAPIFile");
	var OpenAPIFileType = require("../OpenAPIFileType");
	var JsonFileType = require("ilib-loctool-json/JsonFileType");

	var CustomProject = require("loctool/lib/CustomProject.js");
	var TranslationSet =  require("loctool/lib/TranslationSet.js");
	var ResourceString =  require("loctool/lib/ResourceString.js");
	// var ResourcePlural =  require("loctool/lib/ResourcePlural.js");
	// var ResourceArray =  require("loctool/lib/ResourceArray.js");
}

var p = new CustomProject({
	name: 'foo',
	id: 'foo',
	sourceLocale: 'en-US'
}, './test/testfiles', {
	locales:['ru-RU'],
	targetDir: '.',
	nopseudo: true,
	openapi: {
		schemas: ['./test/testfiles/openapi-schema.json'],
		mappings: {

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
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "string1": "This is a test description"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resource = set.getBySource('This is a test description');
			test.ok(resource);

			test.equal(resource.getSource(), 'This is a test description');
			test.equal(resource.getKey(), oaf.markdownFile.makeKey('This is a test description'));

			test.done();
		},

		testParseMarkdownJsonGetBySource: function(test) {
			test.expect(7);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "string1": "Description with `code` in it"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resource = set.getBySource('Description with <c0/> in it');
			test.ok(resource);

			test.equal(resource.getSource(), 'Description with <c0/> in it');
			test.equal(resource.getComment(), "c0 will be replaced with the inline code `code`.");
			test.equal(resource.getKey(), oaf.makeKey('Description with <c0/> in it'));
			test.equal(resource.getDataType(), 'markdown');

			test.done();
		},

		testParseInlineCodeOnlyString: function(test) {
			test.expect(7);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "string1": "Description with `code` in it",\n' +
					'  "string2": "`code only string`",\n' +
					'  "string3": "String with no parameters"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resources = set.getAll();
			test.equal(resources.length, 2);
			test.equal(resources[0].getSource(), 'Description with <c0/> in it');
			test.equal(resources[0].getComment(), 'c0 will be replaced with the inline code `code`.');

			test.equal(resources[1].getSource(), 'String with no parameters');
			test.equal(resources[1].getComment(), null);

			test.done();
		},

		testParseDoubleNewLine: function(test) {
			test.expect(7);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "string1": "First line\\n\\nSecond line `with` code"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resources = set.getAll();
			test.equal(resources.length, 2);
			test.equal(resources[0].getSource(), 'First line');
			test.equal(resources[0].getComment(), null);

			test.equal(resources[1].getSource(), 'Second line <c0/> code');
			test.equal(resources[1].getComment(), 'c0 will be replaced with the inline code `with`.');

			test.done();
		}
	},

	localizeText: {
		testLocalizeTextSimpleJson: function(test) {
			test.expect(2);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});

			test.ok(oaf);

			var jsonToParse = '{\n' +
					'    "description": "This is a test description",\n' +
					'    "title": "this is a test title"\n' +
					'}';
			oaf.parse(jsonToParse);

			var translations = new TranslationSet();
			translations.add(new ResourceString({
				project: 'foo',
				key: oaf.makeKey('This is a test description'),
				source: 'This is a test description',
				sourceLocale: 'en-US',
				target: 'Это тестовое описание',
				targetLocale: 'ru-RU',
				datatype: 'markdown'
			}));

			var actual = oaf.localizeText(translations, 'ru-RU');
			var expected = '{\n' +
					'    "description": "Это тестовое описание",\n' +
					'    "title": "this is a test title"\n' +
					'}\n';

			test.equal(actual, expected);

			test.done();
		},

		testLocalizeTextMarkdownJson: function(test) {
			test.expect(2);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});

			test.ok(oaf);

			var jsonToParse = '{\n' +
					'    "description": "Description with `code` in it",\n' +
					'    "title": "this is a test title",\n' +
					'    "additionalField": "Non-translatable field"\n' +
					'}';
			oaf.parse(jsonToParse);

			var translations = new TranslationSet();
			translations.add(new ResourceString({
				project: 'foo',
				key: oaf.makeKey('Description with <c0/> in it'),
				source: 'Description with <c0/> in it',
				sourceLocale: 'en-US',
				target: 'Описание с <c0/> внутри',
				targetLocale: 'ru-RU',
				datatype: 'markdown'
			}));
			translations.add(new ResourceString({
				project: 'foo',
				key: oaf.makeKey('this is a test title'),
				source: 'this is a test title',
				sourceLocale: 'en-US',
				target: 'это тестовое описание',
				targetLocale: 'ru-RU',
				datatype: 'markdown'
			}));

			var actual = oaf.localizeText(translations, 'ru-RU');
			var expected = '{\n' +
					'    "description": "Описание с `code` внутри",\n' +
					'    "title": "это тестовое описание",\n' +
					'    "additionalField": "Non-translatable field"\n' +
					'}\n';

			test.equal(actual, expected);

			test.done();
		}
	},

	localize: {
		testLocalize: function(test) {
			test.expect(0);

			test.done();
		}
	}
}

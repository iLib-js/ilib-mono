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
	locales:['en-GB'],
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

			test.throws(function (test) {
				var oaf = new OpenAPIFile({
					project: p
				});
			});

			test.done();
		}
	},

	parse: {
		testParseSimpleJsonGetByKey: function(test) {
			test.expect(5);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "description": "This is a test description"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resource = set.get(
					ResourceString.hashKey('foo', 'en-US', 'description', 'json')
			);
			test.ok(resource);

			test.equal(resource.getSource(), 'This is a test description');
			test.equal(resource.getKey(), 'description');

			test.done();
		},

		testParseMarkdownJsonGetByKey: function(test) {
			test.expect(7);

			var oaf = new OpenAPIFile({
				project: p,
				type: t
			});
			test.ok(oaf);

			var jsonToParse = '{\n' +
					'  "description": "Decription with `code` in it"\n' +
					'}';
			oaf.parse(jsonToParse);

			var set = oaf.getTranslationSet();
			test.ok(set);

			var resource = set.get(
					ResourceString.hashKey('foo', 'en-US', 'description', 'json')
			);
			test.ok(resource);

			test.equal(resource.getSource(), 'Description with <c0/> in it');
			test.equal(resource.getKey(), 'description');
			test.equal(resource.getComment(), "c0 will be replaced with the inline code `code`.");
			test.equal(resource.getKey(), "r405516144"); // ?

			test.done();
		}
	}
}

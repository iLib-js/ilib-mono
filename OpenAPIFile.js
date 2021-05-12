var log4js = require('log4js');

var JsonFile = require('ilib-loctool-json/JsonFile');
var MarkdownFile = require('ilib-loctool-ghfm/MarkdownFile');
var logger = log4js.getLogger('loctool.plugin.OpenAPIFile');

var OpenAPIFile = function(options) {
	options.jsonFileType = options.jsonFileType || options.type.jsonFileType;
	if (!options.jsonFileType) {
		if (options.type && options.type.jsonFileType) {
			options.jsonFileType = options.type.jsonFileType;
		} else {
			throw new Error('jsonFileType is not provided. Can not instantiate OpenAPIFile object');
		}
	}

	if (!options.markdownFileType) {
		if (options.type && options.type.markdownFileType) {
			options.markdownFileType = options.type.markdownFileType;
		} else {
			throw new Error('markdownFileType is not provided. Can not instantiate OpenAPIFile object');
		}
	}

	this.API = options.project.getAPI();
	this.type = options.type;
	this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");

	options.type = options.jsonFileType;
	this.jsonFile = new JsonFile(options);

	options.type = options.markdownFileType;
	this.markdownFile = new MarkdownFile(options);
}

OpenAPIFile.prototype.parse = function(data) {
	this.parseJson(data);
	this.parseMarkdown();
}

OpenAPIFile.prototype.parseJson = function(data) {
	this.jsonFile.parse(data);

	this.set = this.jsonFile.getTranslationSet();
}

OpenAPIFile.prototype.parseMarkdown = function () {
	// iterate through this.set and send strings to Markdown parse
	// Then update set based on the result from MD parser
}

OpenAPIFile.prototype.getTranslationSet = function() {
	return this.set;
}

module.exports = OpenAPIFile;

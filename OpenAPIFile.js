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
	this.jsonSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
	this.markdownSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");

	options.type = options.jsonFileType;
	this.jsonFile = new JsonFile(options);

	options.type = options.markdownFileType;
	this.markdownFile = new MarkdownFile(options);
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 *
 * Consists of two steps:
 * 1. Parse json file
 * 2. Parse results of json parsing with markdown parser
 *
 * @param {String} data the string to parse
 */
OpenAPIFile.prototype.parse = function(data) {
	this.parseJson(data);
	this.parseMarkdown();
}

OpenAPIFile.prototype.parseJson = function(data) {
	this.jsonFile.parse(data);

	this.jsonSet = this.jsonFile.getTranslationSet();
}

OpenAPIFile.prototype.parseMarkdown = function () {
	// iterate through this.jsonSet and send strings to Markdown parse
	// Then update set based on the result from MD parser
	this.jsonSet.getAll().map(function (res) {
		if (res.resType === 'string') {
			this.markdownFile.parse(res.source);
		}
	}.bind(this));

	this.markdownSet = this.markdownFile.getTranslationSet();
}

/**
 * Return the set of resources found in the current file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current file.
 */
OpenAPIFile.prototype.getTranslationSet = function () {
	return this.markdownSet;
}

OpenAPIFile.prototype.makeKey = function (source) {
	return this.API.utils.hashKey(MarkdownFile.cleanString(source));
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
OpenAPIFile.prototype.localizeText = function (translations, locale) {
	var jsonTranslationSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");

	this.jsonSet.getAll().forEach(function (res) {
		if (res.resType === 'string') {
			this.markdownFile.parse(res.source);
			var localizedMarkdown = this.markdownFile.localizeText(translations, locale)

			// Remove trailing new line as markdown always appends it to the end of the string.
			localizedMarkdown = localizedMarkdown.replace(/\n$/, '');

			res.setTarget(localizedMarkdown);
			res.setTargetLocale(locale);
			jsonTranslationSet.add(res);
		}
	}.bind(this));

	return this.jsonFile.localizeText(jsonTranslationSet, locale);
}

module.exports = OpenAPIFile;

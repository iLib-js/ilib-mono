var log4js = require('log4js');

var JsonFileType = require('ilib-loctool-json/JsonFileType');
var logger = log4js.getLogger('loctool.plugin.OpenAPIFileType');

var OpenAPIFileType = function(projectConfig) {
	// Copy over openapi config to json key to get support of mappings from json plugin.
	projectConfig.settings.json = projectConfig.settings.openapi;
	this.jsonFileType = new JsonFileType(projectConfig);
}

OpenAPIFileType.prototype.getLocalizedPath = function(template, pathname, locale) {
	return this.jsonFileType.getLocalizedPath(template, pathname, locale);
}

OpenAPIFileType.prototype.getLocaleFromPath = function(template, pathname) {
	return this.jsonFileType.getLocaleFromPath(template, pathname);
}

OpenAPIFileType.prototype.getMapping = function(pathname) {
	return this.jsonFileType.getMapping(pathname);
}

OpenAPIFileType.prototype.handles = function (pathname) {
	return this.jsonFileType.handles(pathname);
}

module.exports = OpenAPIFileType;

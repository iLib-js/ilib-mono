/**
 * MrkdwnJsonFile.js - plugin to extract resources from a json file containing
 * Slack mrkdwn format strings
 *
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var path = require("path");
var MessageAccumulator = require("message-accumulator");
var TreeNode = require("ilib-tree-node");
var Locale = require("ilib/lib/Locale.js");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var JSON5 = require("json5");
var SMP = require("slack-message-parser");

var slackParser = SMP.parse;
var Node = SMP.Node;
var NodeType = SMP.NodeType;

// load the data for these
isAlnum._init();
isIdeo._init();

function escapeQuotes(str) {
    var ret = "";
    if (str.length < 1) {
        return '';
    }
    var inQuote = false;

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
        case '"':
            if (inQuote) {
                if (i+1 < str.length-1 && str[i+1] !== '\n') {
                    ret += '\\';
                }
            } else {
                inQuote = true;
            }
            ret += '"';
            break;
        case '\n':
            inQuote = false;
            ret += '\n';
            break;
        case '\\':
            if (i+1 < str.length-1) {
                i++;
                if (str[i] === '[') {
                    ret += str[i];
                } else {
                    ret += '\\';
                    if (str[i] !== '\\') {
                        ret += str[i];
                    }
                }
            } else {
                ret += '\\';
            }
            break;
        default:
            ret += str[i];
            break;
        }
    }

    return ret;
};

/**
 * Unescape the given string and return it unescaped.
 * This will turn an escaped string that came from a
 * value in a json file, into a full string. It will
 * do the following unescapes:
 * "\n" -> newline char
 * "\t" -> tab char
 * "\"" -> double quote char
 * "\'" -> single quote char
 *
 * @param {string} str the string to unescape
 * @returns {string} the unescaped string
 */
function unescape(str) {
   return str.
       replace(/\\n/g, "\n").
       replace(/\\t/g, "\t").
       replace(/\\'/g, "'").
       replace(/\\"/g, '"');
}

/**
 * Escape the given string and return it escaped. This
 * prepares the string for use as a value in a json
 * file. This function will escape newlines, tabs,
 * single quote, and double quote chars.
 *
 * @param {string} str the string to escape
 * @returns {string} the escaped string
 */
function escape(str) {
    return str.
        replace(/\n/g, "\\n").
        replace(/\t/g, "\\t").
        replace(/'/g, "\\'").
        replace(/"/g, '\\"');
}

/**
 * Deep copy the given object. This is a simple deep copy
 * that works only with objects that can be serialized to
 * JSON. This is used to make a deep copy of the options
 * object so that the original is not modified.
 *
 * @param {Object} obj the object to copy
 * @returns {Object} a deep copy of the given object
 */
function deepCopy(obj) {
    return JSON5.parse(JSON5.stringify(obj));
}

/**
 * Create a new Mrkdwn file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MrkdwnJsonFile = function(options) {
    options = options || {};

    this.project = options.project;
    this.pathName = options.pathName;

    this.API = this.project.getAPI();
    this.type = options.type;
    this.logger = this.API.getLogger("loctool.lib.MrkdwnJsonFile");

    this.mapping = this.type.getMapping(this.pathName);

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.localizeLinks = false;
    // this.componentIndex = 0;
    // if this is set, only produce fully translated mrkdwn files. Otherwise if they
    // are not fully translated, just output the original source text.
    this.fullyTranslated = this.project && this.project.settings && this.project.settings.mrkdwn && this.project.settings.mrkdwn.fullyTranslated;
    this.translationStatus = {};

    if (this.mapping && this.mapping.frontmatter) {
        // needed to parse the front matter, which is in yaml format
        var type = this.type.getYamlFileType();
        this.yamlfile = type.newFile(this.pathName, {
            sourceLocale: this.project.getSourceLocale()
        });
    }
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
MrkdwnJsonFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\(.)/g, "$1");

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code, but it increases the matching between strings
 * that only differ in ways that don't matter.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
MrkdwnJsonFile.cleanString = function(string) {
    var unescaped = MrkdwnJsonFile.unescapeString(string);

    unescaped = unescaped.
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
MrkdwnJsonFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MrkdwnJsonFile.cleanString(source));
};

var reWholeTag = /<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g;

/**
 * If there is text in the given string, create a new resource
 * for it and add it to the translation set. If there is no
 * text, do nothing.
 *
 * @private
 * @param {String} key the key for the resource
 * @param {String} text the text to add as a resource
 * @param {String} comment a comment to add to the resource
 * @returns {Resource} the resource that was added
 */
MrkdwnJsonFile.prototype._addTransUnit = function(key, text, comment) {
    var res;
    if (text) {
        var fullkey = (this.subkey > 0) ? key + "_" + this.subkey : key;
        this.subkey++;
        var source = this.API.utils.escapeInvalidChars(text);
        res = this.API.newResource({
            resType: "string",
            project: this.project.getProjectId(),
            key: fullkey,
            sourceLocale: this.project.sourceLocale,
            source: source,
            autoKey: true,
            pathName: this.pathName,
            state: "new",
            comment: comment,
            datatype: "mrkdwn",
            index: this.resourceIndex++
        });
        this.set.add(res);
    }
    return res;
};

/**
 * @private
 * @param {Object} API
 * @param {string} text
 * @returns {Object} an object containing the leading whitespace, the text,
 * and the trailing whitespace
 */
function trim(API, text) {
    var i, ret = {};
    if (!text) {
        return {
            pre: ""
        };
    }

    for (i = 0; i < text.length && API.utils.isWhite(text.charAt(i)); i++);

    if (i >= text.length) {
        // all white? just return it
        return {
            pre: text
        };
    }

    if (i > 0) {
        ret.pre = text.substring(0, i);
        text = text.substring(i);
    }

    for (i = text.length-1; i > -1 && API.utils.isWhite(text.charAt(i)); i--);

    if (i < text.length-1) {
        ret.post = text.substring(i+1);
        text = text.substring(0, i+1);
    }

    ret.text = text;

    // console.log('text: pre is "' + ret.pre + '" value is "' + ret.text + '" and post is "' + ret.post + '"');

    return ret;
}

// schemes are registered in the IANA list
var reUrl = /^(https?|github|ftps?|mailto|file|data|irc):\/\/[\S]+$/;

/**
 * Return true if the given string contains translatable text,
 * and false otherwise. For example, a string extracted with only
 * punctuation or only an URL in it is not translatable.
 *
 * @param {string} str the string to test
 * @returns {boolean} true if the given string contains translatable text,
 * and false otherwise.
 */
MrkdwnJsonFile.prototype.isTranslatable = function(str) {
    if (!str || !str.length || !str.trim().length) return false;

    if (!this.localizeLinks) {
        reUrl.startIndex = 0;
        var match = reUrl.exec(str);
        if (match && match.length) return false;
    }

    return this.API.utils.containsActualText(str);
}

/**
 * Emit the text as a new Resource if it is translatable and
 * attach it to the given node.
 *
 * @param {Node} node the node to localize
 * @param {boolean} escape true if you want the translated
 * text to be escaped for attribute values
 * @private
 */
MrkdwnJsonFile.prototype._emitText = function(node, key, escape) {
    if (!this.message.getTextLength()) {
        this.message = new MessageAccumulator();
        return;
    }

    var text = this.message.getMinimalString();

    this.logger.trace('text using message accumulator is: ' + text);

    if (this.message.isTranslatable || this.isTranslatable(text)) {
        var res = this._addTransUnit(key, text, this.comment);
        // store the resource and the message accumulator on the node
        // for later use when localizing
        if (res) {
            node.resource = res;
            node.message = this.message;
        }
        var prefixes = this.message.getPrefix();
        var suffixes = this.message.getSuffix();

        prefixes.concat(suffixes).forEach(function(end) {
            if (typeof(end) === "object") {
                end.localizable = false;
            }
        });
    }
    this.comment = undefined;
    this.message = new MessageAccumulator();
};


var reTagName = /^<(\/?)\s*(\w+)(\s+((\w+)(\s*=\s*('((\\'|[^'])*)'|"((\\"|[^"])*)"))?)*)*(\/?)>$/;
var reSelfClosingTag = /<\s*(\w+)\/>$/;
var reL10NComment = /<!--\s*[iI]18[Nn]\s*(.*)\s*-->/;

/**
 * @private
 * Walk the tree looking for localizable text.
 * @param {AST} node the current node of an abstract syntax tree to
 * walk.
 */
MrkdwnJsonFile.prototype._walk = function(key, node) {
    switch (node.type) {
        case NodeType.Text:
            var parts = trim(this.API, node.text);
            // only localizable if there already is some localizable text
            // or if this text contains anything that is not whitespace
            if (this.message.getTextLength() > 0 || parts.text) {
                this.message.addText(node.text);
                this.message.isTranslatable = this.localizeLinks;
                node.localizable = true;
            }
            break;

        case NodeType.Italic:
        case NodeType.Bold:
        case NodeType.Strike:
        case NodeType.Quote:
            if (node.children && node.children.length) {
                this.message.push({
                    name: node.type,
                    node: node
                });
                node.children.forEach(function(child) {
                    this._walk(key, child);
                }.bind(this));
                this.message.pop();

                node.localizable = node.children.every(function(child) {
                    return child.localizable;
                });
            }
            break;

        case NodeType.PreText:
            // ignore any text inside of preformatted text
            this._emitText(key);
            break;

        case NodeType.ChannelLink:
        case NodeType.UserLink:
        case NodeType.Command:
        case NodeType.URL:
            this.message.push({
                name: node.type,
                node: node
            });
            node.label && node.label.forEach(function(child) {
                this._walk(key, child);
            }.bind(this));
            this.message.pop();

            node.localizable = (node.label && node.label.every(function(child) {
                return child.localizable;
            })) || true;
            break;

        case NodeType.Emoji:
        case NodeType.Code:
            // we never localize code or emojis but we need to hold its place in the string
            this.message.push({
                name: node.type,
                node: node
            });
            node.localizable = true;
            this.message.pop();
            break;

        default:
            this._emitText(key);
            var subnodes = node.children || node.label;
            if (subnodes && subnodes.length) {
                subnodes.forEach(function(child, index, array) {
                    this._walk(key, child);
                }.bind(this));
            }
            break;
    }
};

/**
 * Parse a string written in Slack mrkdwn syntax and return
 * the AST that represent that string. While it is doing that,
 * it also extracts the localizable strings and adds them to
 * the translation set.
 *
 * @param {string} key the unique key for the resource. If there
 * are more than one resource in this string, they will all use
 * this key as a prefix, followed by an underscore, followed by
 * a unique number for the substring.
 * @param {string} str the string to parse
 * @returns {Node} The root node of the abstract syntax tree that
 * represents the parsed string. 
 */
MrkdwnJsonFile.prototype.parseMrkdwnString = function(key, str) {
    // accumulates characters in text segments
    this.message = new MessageAccumulator();
    this.subkey = 0;

    var ast = slackParser(unescape(str));

    this._walk(key, ast);

    // in case any is left over at the end
    this._emitText(key);

    return ast;
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MrkdwnJsonFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    try {
        // use json5 parse because is more flexible and allows for things like comments and such
        var json = JSON5.parse(data);
        var ids = Object.keys(json);
        this.contents = {};
        ids.forEach(function(key) {
            var value = json[key];
            // value is the original string
            // also remember the ast for when we localize the file later
            this.contents[key] = {
                value: value,
                ast: this.parseMrkdwnString(key, value)
            };
        }.bind(this));
    } catch (e) {
        this.logger.error("Failed to parse file " + this.pathName + "\nException: " + e);
    }
};

/**
 * Extract all the localizable strings from the md file and add them to the
 * project's translation set.
 */
MrkdwnJsonFile.prototype.extract = function() {
    this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
            this.logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current Java file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
MrkdwnJsonFile.prototype.getTranslationSet = function() {
    return this.set;
};

//we don't write Mrkdwn source files
MrkdwnJsonFile.prototype.write = function() {};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
MrkdwnJsonFile.prototype.getOutputLocale = function(mapping, locale) {
    // we can remove the replace() call after upgrading to
    // ilib 14.10.0 or later because it can parse locale specs
    // with underscores in them
    return new Locale(
        (mapping && mapping.localeMap && mapping.localeMap[locale] &&
         mapping.localeMap[locale].replace(/_/g, '-')) ||
        this.project.getOutputLocale(locale));
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
MrkdwnJsonFile.prototype.getLocalizedPath = function(locale) {
    var mapping = this.mapping || this.type.getMapping(path.normalize(this.pathName)) || this.type.getDefaultMapping();
    var l = this.getOutputLocale(mapping, locale);

    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: l
    }));
};

/**
 * @private
 * @param {string} key the key for the resource
 * @param {source} source the source string to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations to use
 * @param {boolean} nopseudo if true, don't use pseudo-localization
 * @returns {string} the localized string
 */
MrkdwnJsonFile.prototype._localizeString = function(key, source, locale, translations, nopseudo) {
    if (!source) return source;

    var tester = this.API.newResource({
        type: "string",
        project: this.project.getProjectId(),
        sourceLocale: this.project.getSourceLocale(),
        reskey: key,
        datatype: "mrkdwn"
    });
    // var hashkey = ResourceString.hashKey(this.project.getProjectId(), locale, key, "mrkdwn");
    var hashkey = tester.hashKeyForTranslation(locale);
    var translatedResource = translations.get(hashkey);
    var translation;

    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
        translation = source;
    } else if (translatedResource) {
        translation = translatedResource.getTarget();
    } else if (this.type) {
        if (source && this.type.pseudos && this.type.pseudos[locale]) {
            var sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
            if (sourceLocale !== this.project.sourceLocale) {
                // translation is derived from a different locale's translation instead of from the source string
                var sourceRes = translations.get(tester.hashKeyForTranslation(sourceLocale));
                source = sourceRes ? sourceRes.getTarget() : source;
            }
            translation = this.type.pseudos[locale].getString(source);
        } else {
            this.logger.trace("New string found: " + source);
            this.type.newres.add(this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: this.API.utils.escapeInvalidChars(source),
                targetLocale: locale,
                target: this.API.utils.escapeInvalidChars(source),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                datatype: "mrkdwn",
                index: this.resourceIndex++
            }));

            translation = source;

            if (this.type.missingPseudo && !nopseudo && !this.project.settings.nopseudo) {
                translation = this.type.missingPseudo.getString(source);
            }
        }
        this.translationStatus[locale] = false; // mark this file as not fully translated in this locale
    } else {
        translation = source;
        this.translationStatus[locale] = false; // mark this file as not fully translated in this locale
    }

    return translation;
};

/**
 * @private
 */
MrkdwnJsonFile.prototype._addComment = function(comment) {
    if (!this.comment) {
        this.comment = comment;
    } else {
        this.comment += " " + comment;
    }
};

/**
 * @private
 * @param {Node} node
 * @param {MessageAccumulator} message
 * @param {String} locale
 * @param {TranslationSet} translations
 * @returns {Node} the localized nodea
 */
MrkdwnJsonFile.prototype._localizeNode = function(node, message, locale, translations) {
    var match, translation, trimmed;

    switch (node.type) {
        case 'text':
            var parts = trim(this.API, node.value);
            // only localizable if there already is some localizable text
            // or if this text contains anything that is not whitespace
            if (node.localizable || parts.text) {
                message.addText(node.value);
            }
            break;

        case 'delete':
        case 'link':
        case 'emphasis':
        case 'strong':
            if (node.title) {
               node.title = this._localizeString(node.title, locale, translations);
            }
            if (node.url && node.localizedLink) {
                // don't pseudo-localize URLs
                node.url = this._localizeString(node.url, locale, translations, true);
            }
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else {
                    message.pop();
                }
            }
            break;

        case 'image':
        case 'imageReference':
            if (node.title) {
                node.title = this._localizeString(node.title, locale, translations);
            }
            if (node.alt) {
                node.alt = this._localizeString(node.alt, locale, translations);
            }
            // images are non-breaking, self-closing nodes
            if (node.localizable) {
                message.push(node);
                message.pop();
            }
            break;

        case 'footnoteReference':
            // footnote references are non-breaking, self-closing nodes
            if (node.localizable) {
                message.push(node, true);
                message.pop();
            }
            break;

        case 'linkReference':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node, true);
                } else if (node.use === "startend") {
                    message.push(node, true);
                    message.pop();
                } else {
                    message.pop();
                }
            }
            break;

        case 'inlineCode':
            // inline code is a non-breaking, self-closing node
            if (node.localizable) {
                message.push(node, true);
                message.pop();
            }
            break;

        case 'definition':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else if (node.use === "startend") {
                    message.push(node, true);
                    message.pop();
                } else {
                    message.pop();
                }

                if (node.url) {
                    // don't pseudo-localize URLs
                    node.url = this._localizeString(node.url, locale, translations, true);
                }
                if (node.title) {
                    node.title = this._localizeString(node.title, locale, translations);
                }
            }
            break;

        case 'footnoteDefinition':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else {
                    message.pop();
                }
            }
            break;

        case 'html':
            if (!node.value) {
                // container node, don't need to do anything for this one
                break;
            }
            trimmed = node.value.trim();
            if (trimmed.substring(0, 4) === '<!--') {
                reL10NComment.lastIndex = 0;
                match = reL10NComment.exec(node.value);
                if (match) {
                    this._addComment(match[1].trim());
                }
                // ignore HTML comments
                break;
            }
            if (trimmed.startsWith("<script") || trimmed.startsWith("<style")) {
                // don't parse style or script tags. Just skip them.
                break;
            }
            reSelfClosingTag.lastIndex = 0;
            match = reSelfClosingTag.exec(trimmed);
            if (match) {
                tagName = match[1];
                if (node.localizable) {
                    message.push(node);
                    message.pop();
                }
            } else {
                reTagName.lastIndex = 0;
                match = reTagName.exec(trimmed);

                if (match) {
                    var tagName = match[2];
                    if (match[1] !== '/') {
                        // opening tag
                        node.value = this._localizeAttributes(tagName, node.value, locale, translations);
                        if (node.localizable && this.API.utils.nonBreakingTags[tagName]) {
                            node.name = tagName;
                            message.push(node);
                            if (node.selfclosing || this.API.utils.selfClosingTags[tagName]) {
                                message.pop();
                            }
                        }
                    } else {
                        // closing tag
                        if (node.localizable && this.API.utils.nonBreakingTags[tagName] && message.getCurrentLevel() > 0) {
                            var tag = message.pop();
                            while (tag.name !== tagName && message.getCurrentLevel() > 0) {
                                tag = message.pop();
                            }
                            if (tag.name !== tagName) {
                                throw new Error("Syntax error in mrkdwn file " + this.pathName + " line " +
                                    node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                            }
                        }
                    }
                } else if (node.value) {
                    var line = (node.position && node.position.start.line) || "?";
                    var column = (node.position && node.position.start.column) || "?";
                    throw new Error("Syntax error in mrkdwn file " + this.pathName + " line " +
                        line + " column " + column + ". Bad HTML tag: " + node.value);
                } // else empty html is just a container for some children
            }
            break;

        case 'yaml':
            if (this.mapping && this.mapping.frontmatter) {
                // rely on the yaml plugin to localize the yaml properly
                node.value = this.yamlfile.localizeText(translations, locale);
            }
            break;

        default:
            break;
    }
};

function mapToAst(node) {
    var children = [];

    for (var i = 0; i < node.children.length; i++) {
        var child = mapToAst(node.children[i]);
        children.push(child);
    }
    if (node.extra) {
        if (children.length) {
            node.extra.children = node.extra.children ? node.extra.children.concat(children) : children;
        }
        return node.extra;
    }
    return u(node.type, node, children);
}

/**
 * @param {Node} node the source node to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations
 * @returns {Array.<Node>} the array of nodes that represent the translation
 */
MrkdwnJsonFile.prototype._getTranslationNodes = function(node, locale, translations) {
    if (ma.getTextLength() === 0) {
        // nothing to localize
        return undefined;
    }

    var text = node.resource.getSource();
    var ma = node.message;

    var translation = this._localizeString(node.resource.key, text, locale, translations);

    if (translation) {
        var transMa = MessageAccumulator.create(translation, ma);
        var nodes = transMa.root.toArray();
        // don't return the "root" start and end nodes
        nodes = nodes.slice(1, -1);

        // warn about components in the target that don't exist in the source,
        // and remove them from the node array as if they didn't exist
        var maxIndex = Object.keys(ma.getMapping()).length;
        var mismatch = false;

        for (i = 0; i < nodes.length; i++) {
           if (nodes[i].type == 'component' && (!nodes[i].extra || nodes[i].index > maxIndex)) {
               nodes.splice(i, 1);
               mismatch = true;
           }
        }
        if (mismatch) {
            this.logger.warn("Warning! Translation of\n'" + text + "' (key: " + key + ")\nto locale " + locale + " is\n'" + translation + "'\nwhich has a more components in it than the source.");
        }

        return nodes;
    }

    return undefined;
};

function mapToNodes(astNode) {
    var node = new Node(astNode);
    if (astNode.children) {
        for (var i = 0; i < astNode.children.length; i++) {
            node.add(mapToNodes(astNode.children[i]));
        }
    }
    return node;
}

/**
 * If the given node contains a reference to a resource that is
 * localizable, then localize the node to the given locale.
 *
 * @param {Node} node the node to localize
 * @param {String} locale the locale
 * @param {TranslationSet} translations the set of translations
 * @returns {Node} the localized node
 */
MrkdwnJsonFile.prototype.localizeNode = function(node, locale, translations) {
    var localizedNode = {};
    if (node.resource && node.message) {
        this._getTranslationNodes(locale, translations, node.message);
    }
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
MrkdwnJsonFile.prototype.localizeText = function(translations, locale) {
    this.resourceIndex = 0;

    this.logger.debug("Localizing strings for locale " + locale);

    var localized = {};

    for (var key in this.contents) {
        // copy the ast for this locale so that we don't modify the original
        var ast = deepCopy(this.contents[key].ast);

        // First, walk the source ast to find the localizable strings, and then
        // look up the translations for those strings in the translation set.
        // A translation is a mini-xml document that may have a different
        // structure than the source document. To deal with that, we convert
        // this xml document to a tree of nodes, then we walk that tree to convert
        // it back to a string in mrkdwn format, making sure to convert subnodes
        // along the way.


        // flatten the tree into an array and then walk the array finding
        // localizable segments that will get replaced with the translation
        var nodeArray = mapToNodes(ast).toArray();

        var start = -1, end;
    
        this.translationStatus[locale] = true;
    
        for (var i = 0; i < nodeArray.length; i++) {
            this._localizeNode(nodeArray[i], locale, translations);
        }
    }
    /*
            if (nodeArray[i].localizable) {
                if (start < 0) {
                    start = i;
                }
                end = i;
            } else if (start > -1) {
                if (this.isTranslatable(ma.getMinimalString())) {
                    var nodes = this._getTranslationNodes(locale, translations, ma);
                    if (nodes) {
                        // replace the source nodes with the translation nodes
                        var prefix = ma.getPrefix();
                        var suffix = ma.getSuffix();
                        var oldLength = nodeArray.length;
                        nodeArray = nodeArray.slice(0, start).concat(prefix).concat(nodes).concat(suffix).concat(nodeArray.slice(end+1));
    
                        // adjust for the difference in node length of the source and translation
                        i += (nodeArray.length - oldLength);
                    } // else leave the source nodes alone and register this string as new
                }
                start = -1;
                ma = new MessageAccumulator();
            }
        }
    
        // in case any is left over at the end
        if (start > -1 && ma.getTextLength()) {
            var nodes = this._getTranslationNodes(locale, translations, ma);
            if (nodes) {
                // replace the last few source nodes with the translation nodes
                var prefix = ma.getPrefix();
                var suffix = ma.getSuffix();
                nodeArray = nodeArray.slice(0, start).concat(prefix).concat(nodes).concat(suffix).concat(nodeArray.slice(end+1));
            } // else leave the source nodes alone
        }
    
        // convert to a tree again
        ast = mapToAst(Node.fromArray(nodeArray));

        var str = mdstringify.stringify((!this.fullyTranslated || this.translationStatus[locale]) ? ast : this.ast);
        this.localized[key] = str;
    }
*/

    return JSON5.stringify(this.localized, null, 4);
};

/**
 * Localize the contents of this Mrkdwn file and write out the
 * localized Mrkdwn file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MrkdwnJsonFile.prototype.localize = function(translations, locales) {
    var pathName;
    for (var i = 0; i < locales.length; i++) {
        if (!this.project.isSourceLocale(locales[i])) {
            // skip variants for now until we can handle them properly
            var l = new Locale(locales[i]);
            pathName = "";
            if (!l.getVariant()) {
                pathName = this.getLocalizedPath(locales[i]);
                this.logger.debug("Writing file " + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
            }

            this.type.addTranslationStatus({
                path: pathName,
                locale: locales[i],
                fullyTranslated: this.translationStatus[locales[i]]
            });
        }
    }
};

module.exports = MrkdwnJsonFile;

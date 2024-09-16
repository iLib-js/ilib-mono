/**
 * MrkdwnJsFile.js - plugin to extract resources from a json file containing
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
var Locale = require("ilib/lib/Locale.js");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var JSON5 = require("json5");
var SMP = require("slack-message-parser");

var slackParser = SMP.parse;
var NodeType = SMP.NodeType;

// load the data for these
isAlnum._init();
isIdeo._init();

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
 * Create a new Mrkdwn file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MrkdwnJsFile = function(options) {
    options = options || {};

    this.project = options.project;
    this.pathName = options.pathName;

    this.API = this.project.getAPI();
    this.type = options.type;
    this.logger = this.API.getLogger("loctool.lib.MrkdwnJsFile");

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
MrkdwnJsFile.prototype._addTransUnit = function(key, text, comment) {
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


/**
 * Return true if the given string contains translatable text,
 * and false otherwise. For example, a string extracted with only
 * punctuation or only an URL in it is not translatable.
 *
 * @param {string} str the string to test
 * @returns {boolean} true if the given string contains translatable text,
 * and false otherwise.
 */
MrkdwnJsFile.prototype.isTranslatable = function(str) {
    if (!str || !str.length || !str.trim().length) return false;

    return this.API.utils.containsActualText(str);
}

/**
 * Emit the text as a new Resource if it is translatable and
 * attach it to the given node.
 *
 * @param {Node} node the node to localize
 * @param {string} key the key for the resource
 * @param {string} comment a comment to associate with the resource
 * @private
 */
MrkdwnJsFile.prototype._emitText = function(node, key, comment) {
    if (!this.message.getTextLength()) {
        this.message = new MessageAccumulator();
        return;
    }

    var text = this.message.getMinimalString();

    this.logger.trace('text using message accumulator is: ' + text);

    if (this.isTranslatable(text)) {
        var res = this._addTransUnit(key, text, comment);
        // store the resource and the message accumulator on the node
        // for later use when localizing
        if (res) {
            node.resource = res;
            node.message = this.message;
        }
    }

    this.message = new MessageAccumulator();
};

/**
 * @private
 * Walk the tree collecting localizable text.
 * @param {AST} node the current node of an abstract syntax tree to
 * walk.
 */
MrkdwnJsFile.prototype._walk = function(key, node) {
    switch (node.type) {
        case NodeType.Text:
            var parts = trim(this.API, node.text);
            // only localizable if there already is some localizable text
            // or if this text contains anything that is not whitespace
            if (this.message.getTextLength() > 0 || parts.text) {
                this.message.addText(node.text);
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
                }, true);
                node.children.forEach(function(child) {
                    this._walk(key, child);
                }.bind(this));
                this.message.pop();
            }
            break;

        case NodeType.ChannelLink:
        case NodeType.UserLink:
        case NodeType.Command:
        case NodeType.URL:
            this.message.push({
                name: node.type,
                node: node
            }, true);
            node.label && node.label.forEach(function(child) {
                this._walk(key, child);
            }.bind(this));
            this.message.pop();
            break;

        case NodeType.PreText:
        case NodeType.Emoji:
        case NodeType.Code:
            // we never localize code or emojis but we need to hold its place in the string
            this.message.push({
                name: node.type,
                node: node
            }, true);
            this.message.pop();
            break;

        default:
            this._emitText(node, key);
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
 * @param {string} comment a comment to associate with the resource
 * @returns {Node} The root node of the abstract syntax tree that
 * represents the parsed string.
 */
MrkdwnJsFile.prototype.parseMrkdwnString = function(key, str, comment) {
    // accumulates characters in text segments
    this.message = new MessageAccumulator();
    this.subkey = 0;

    var ast = slackParser(unescape(str));

    this._walk(key, ast);

    // in case any is left over at the end
    this._emitText(ast, key, comment);

    return ast;
};

var commentRe = /^\s*\/\/(.*)$/g;
var lineRe = /^\s*('([^']*)'|"([^"]*)")\s*:\s*('([^']*)'|"([^"]*)")\s*,?$/g;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MrkdwnJsFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    try {
        var lines = data.split("\n");
        this.contents = {};
        var lastComment;
        lines.forEach(function(line) {
            commentRe.lastIndex = 0;
            var match = commentRe.exec(line);
            if (match) {
                lastComment = match[1];
                return;
            }

            lineRe.lastIndex = 0;
            match = lineRe.exec(line);
            if (match) {
                var key = match[2] || match[3];
                var value = match[5] || match[6];
                this.contents[key] = {
                    value: value,
                    comment: lastComment,
                    ast: this.parseMrkdwnString(key, value, lastComment)
                };
            }

            // else ignore the line
        }.bind(this));
    } catch (e) {
        this.logger.error("Failed to parse file " + this.pathName + "\nException: " + e);
    }
};

/**
 * Extract all the localizable strings from the md file and add them to the
 * project's translation set.
 */
MrkdwnJsFile.prototype.extract = function() {
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
MrkdwnJsFile.prototype.getTranslationSet = function() {
    return this.set;
};

//we don't write Mrkdwn source files
MrkdwnJsFile.prototype.write = function() {};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
MrkdwnJsFile.prototype.getOutputLocale = function(mapping, locale) {
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
MrkdwnJsFile.prototype.getLocalizedPath = function(locale) {
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
MrkdwnJsFile.prototype.localizeString = function(key, source, locale, translations, nopseudo) {
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
 * Stringify the given AST node into mrkdwn format.
 *
 * @private
 * @param {Node} node the node to stringify
 * @returns {string} the stringified node
 */
MrkdwnJsFile.prototype.stringifyAstNode = function(node, children, args, label) {
    var ret = "";

    switch (node.type) {
        case NodeType.Italic:
            ret += "_" + children + "_";
            break;

        case NodeType.Bold:
            ret += "*" + children + "*";
            break;

        case NodeType.Strike:
            ret += "~" + children + "~";
            break;

        case NodeType.Quote:
            ret += ">" + children + "\n";
            break;

        case NodeType.ChannelLink:
            ret += "<#" +
                node.channelID +
                (label ? "|" + label : "") +
                ">";
            break;

        case NodeType.UserLink:
            ret += "<@" +
                node.userID +
                (label ? "|" + label : "") +
                ">";
            break;

        case NodeType.Command:
            ret += "<!" +
                node.name +
                (args ? "^" + args : "") +
                (label ? "|" + label : "") +
                ">";
            break;

        case NodeType.URL:
            ret += "<" +
                node.url +
                (label ? "|" + label : "") +
                ">";
            break;

        case NodeType.PreText:
        case NodeType.Emoji:
        case NodeType.Code:
            ret += node.source;
            break;

        default:
            if (children) {
                ret += children;
            }
            break;
    }
    return ret;
};

/**
 * Take a tree of nodes from a message accumulator and return a string
 * that represents the tree in mrkdwn format.
 *
 * @private
 * @param {Array.<Node>} nodes the root of the tree to stringify
 * @returns {String} the stringified tree
 */
MrkdwnJsFile.prototype.stringify = function(nodes) {
    var ret = "";
    if (!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    if (nodes && nodes.length) {
        nodes.forEach(function(node) {
            switch (node.type) {
                case "text":
                    ret += node.value;
                    break;

                case "root":
                    ret += this.stringify(node.children);
                    break;

                case "component":
                    if (node.extra && node.extra.node) {
                        var astNode = node.extra.node;
                        var children = node.children && this.stringify(node.children);
                        ret += this.stringifyAstNode(astNode, children, astNode.arguments && astNode.arguments.join("^"), children);
                    } else {
                        // a component that does not exist in the source?
                        // just render its children
                        ret += this.stringify(node.children);
                    }
                    break;
            }
        }.bind(this));
    }
    return ret;
};

/**
 * Return the translation for the given node in the given locale.
 * The node must have a resource and a message associated with it.
 *
 * @private
 * @param {Node} node the source node to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations
 * @returns {string} the translation at the given node
 */
MrkdwnJsFile.prototype.getTranslation = function(node, locale, translations) {
    if (!node || !node.resource || !node.message) {
        return "";
    }
    var text = node.resource.getSource();
    var ma = node.message;
    if (ma.getTextLength() === 0) {
        // nothing to localize
        return "";
    }

    var translation = this.localizeString(node.resource.getKey(), text, locale, translations);

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
            this.logger.warn("Warning! Translation of\n'" + text + "' (key: " +node.resource.getKey() + ")\nto locale " + locale + " is\n'" + translation + "'\nwhich has a more components in it than the source.");
        }

        return this.stringify(transMa.root);
    }

    return "";
};

/**
 * Return the translation for the given node in the given locale.
 *
 * @private
 * @param {Node} node the source node to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations
 * @returns {string} the translation at the given node
 */
MrkdwnJsFile.prototype.walkAst = function(node, locale, translations) {
    var ret = "";
    if (node.message && node.resource) {
        ret += this.getTranslation(node, locale, translations);
    } else {
        var children, label;
        if (node.children) {
            children = "";
            for (var i = 0; i < node.children.length; i++) {
                children += this.walkAst(node.children[i], locale, translations);
            }
        }
        if (node.label) {
            label = "";
            for (var i = 0; i < node.label.length; i++) {
                label += this.walkAst(node.label[i], locale, translations);
            }
        }
        ret += this.stringifyAstNode(node, children, node.arguments, label);
    }
    return ret;
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
MrkdwnJsFile.prototype.localizeText = function(translations, locale) {
    this.resourceIndex = 0;
    this.logger.debug("Localizing strings for locale " + locale);

    var localized = {};

    for (var key in this.contents) {
        var ast = this.contents[key].ast;

        localized[key] = this.walkAst(ast, locale, translations);
    }

    var output;
    if (!this.project.settings || this.project.settings.outputStyle === "commonjs") {
        output = "module.exports = ";
    } else {
        output = "export default messages = ";
    }
    output += JSON.stringify(localized, null, 4) + ";\n";
    return output;
};

/**
 * Localize the contents of this Mrkdwn file and write out the
 * localized Mrkdwn file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MrkdwnJsFile.prototype.localize = function(translations, locales) {
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
        }
    }
};

module.exports = MrkdwnJsFile;

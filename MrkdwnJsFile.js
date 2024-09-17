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
var SMP = require("slack-message-parser");

var slackParser = SMP.parse;
var NodeType = SMP.NodeType;

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
 * Clone the given AST node and return a new node that is a deep
 * copy of the original node.
 *
 * @param {Node} node the node to clone
 * @returns {Node} a new node that is a deep copy of the
 * original node
 */
function cloneAst(node) {
    var ret = {};
    for (var prop in node) {
        if (prop === "children") {
            ret.children = node.children.map(cloneAst);
        } else if (prop === "label") {
            ret.label = node.label.map(cloneAst);
        } else {
            ret[prop] = node[prop];
        }
    }
    return ret;
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
MrkdwnJsFile.prototype.stringify = function(node) {
    var ret = "";

    switch (node.type) {
        case NodeType.Italic:
            ret += "_" + node.children.map(this.stringify).join("") + "_";
            break;

        case NodeType.Bold:
            ret += "*" + node.children.map(this.stringify).join("") + "*";
            break;

        case NodeType.Strike:
            ret += "~" + node.children.map(this.stringify).join("") + "~";
            break;

        case NodeType.Quote:
            ret += ">" + node.children.map(this.stringify).join("") + "\n";
            break;

        case NodeType.ChannelLink:
            ret += "<#" +
                node.channelID +
                (node.label ? "|" + node.label.map(this.stringify).join("") : "") +
                ">";
            break;

        case NodeType.UserLink:
            ret += "<@" +
                node.userID +
                (node.label ? "|" + node.label.map(this.stringify).join("") : "") +
                ">";
            break;

        case NodeType.Command:
            ret += "<!" +
                node.name +
                (node.arguments ? "^" + node.arguments.map(this.stringify).join("^") : "") +
                (node.label ? "|" + node.label.map(this.stringify).join("") : "") +
                ">";
            break;

        case NodeType.URL:
            ret += "<" +
                node.url +
                (node.label ? "|" + node.label.map(this.stringify).join("") : "") +
                ">";
            break;

        case NodeType.PreText:
            ret = "```" + node.text + "```";
            break;

        case NodeType.Emoji:
            ret = ":" + node.name + (node.variation ? "::" + node.variation : "") + ":";
            break;

        case NodeType.Code:
            ret = "`" + node.text + "`";
            break;

        default:
            if (node.children) {
                ret += node.children.map(this.stringify).join("");
            }
            break;
    }
    return ret;
};

/**
 * Convert a message accumulator node into an AST node.
 *
 * @private
 * @param {Node} node the node to convert
 * @returns {Node} the converted node
 */
MrkdwnJsFile.prototype.convertMAToASTNode = function(node) {
    if (!node) {
        return;
    }
    var ret = {};
    switch (node.type) {
        case "text":
            ret.type = NodeType.Text;
            ret.text = node.value;
            break;

        case "root":
            ret.type = NodeType.Root;
            ret.children = node.children.map(this.convertMAToASTNode);
            break;

        case "param":
            ret.type = NodeType.Text;
            ret.text = node.value;
            break;

        case "component":
            // message-accumulator nodes have an extra field that
            // points to the AST node that this node originally
            // represented in the source string.
            // Convert the current node to be like that AST node.
            if (node.extra && node.extra.node) {
                var astNode = node.extra.node;

                ret.type = astNode.type;
                switch (astNode.type) {
                    case NodeType.Italic:
                    case NodeType.Bold:
                    case NodeType.Strike:
                    case NodeType.Quote:
                        ret.children = node.children && node.children.map(this.convertMAToASTNode);
                        break;

                    case NodeType.ChannelLink:
                        ret.channelID = astNode.channelID;
                        ret.label = node.children && node.children.map(this.convertMAToASTNode);
                        break;

                    case NodeType.UserLink:
                        ret.userID = astNode.userID;
                        ret.label = node.children && node.children.map(this.convertMAToASTNode);
                        break;

                    case NodeType.Command:
                        ret.name = astNode.name;
                        ret.arguments = astNode.arguments;
                        ret.label = node.children && node.children.map(this.convertMAToASTNode);
                        break;

                    case NodeType.URL:
                        ret.url = astNode.url;
                        ret.label = node.children && node.children.map(this.convertMAToASTNode);
                        break;

                    case NodeType.PreText:
                        ret.text = astNode.text;
                        break;

                    case NodeType.Emoji:
                        ret.name = astNode.name;
                        ret.variation = astNode.variation;
                        break;

                    case NodeType.Code:
                        ret.text = astNode.text;
                        break;

                    default:
                        // don't need to do anything for the root node
                        break;
                }
            } else {
                // a component that does not exist in the source?
                // just convert its children
                ret.type = NodeType.Root;
                ret.children = node.children && node.children.map(this.convertMAToASTNode);
            }
            break;
    }
    return ret;
}


/**
 * Mute the current AST node into a new one that represents the
 * localized version of the string at this point in the tree. If a
 * node has a resource and a message accumulator associated with it, then the
 * resource is used to look up the translation in the given set of
 * translations. If a translation is found, then the node
 * is replaced with a new tree that represents the localized
 * version of the string. Note that the new tree may have a different
 * structure than the original tree, as some components
 * may be moved around or nested differently in the localized version
 * of the string.
 *
 * @private
 * @param {Node} node the source node to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations
 */
MrkdwnJsFile.prototype.getTranslation = function(node, locale, translations) {
    if (!node || !node.resource || !node.message) {
        return;
    }
    var text = node.resource.getSource();
    var ma = node.message;
    if (ma.getTextLength() === 0) {
        // nothing to localize, so don't mute the node
        return;
    }

    var translation = this.localizeString(node.resource.getKey(), text, locale, translations);

    if (translation) {
        var transMa = MessageAccumulator.create(translation, ma);

        // check for components in the target that don't exist in the source and give a warning
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

        var translationNode = this.convertMAToASTNode(transMa.root);
        node.type = translationNode.type;
        // this can re-arrange the tree structure if the translation has components in a different
        // order or nested differently than the source
        node.children = translationNode.children;
        node.label = translationNode.label;
    }
};

/**
 * Walk the AST to find the nodes that contain localizable strings and
 * replace them with new AST nodes that represent the localized strings.
 *
 * @private
 * @param {Node} node the source node to localize
 * @param {string} locale the locale to localize to
 * @param {TranslationSet} translations the set of translations
 */
MrkdwnJsFile.prototype.walkAst = function(node, locale, translations) {
    if (node.message && node.resource) {
        this.getTranslation(node, locale, translations);
    } else {
        if (node.children) {
            children = "";
            for (var i = 0; i < node.children.length; i++) {
                this.walkAst(node.children[i], locale, translations);
            }
        }
        if (node.label) {
            label = "";
            for (var i = 0; i < node.label.length; i++) {
                this.walkAst(node.label[i], locale, translations);
            }
        }
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
MrkdwnJsFile.prototype.localizeText = function(translations, locale) {
    this.resourceIndex = 0;
    this.logger.debug("Localizing strings for locale " + locale);

    var localized = {};

    for (var key in this.contents) {
        // don't mess with the original AST because we still need it
        // for the other locales
        var ast = cloneAst(this.contents[key].ast);

        // walk the AST to find the nodes that contain localizable strings and
        // replace them with nodes that represent the localized strings.
        this.walkAst(ast, locale, translations);

        // stringify the modified AST to get the final localized string
        localized[key] = this.stringify(ast);
    }

    var output;
    if (!this.project.settings || this.project.settings.outputStyle === "commonjs") {
        output = "module.exports.messages = ";
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

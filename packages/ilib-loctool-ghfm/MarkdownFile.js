/*
 * MarkdownFile.js - plugin to extract resources from an Markdown file
 *
 * Copyright © 2019-2023, Box, Inc.
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

var fs = require("fs");
var path = require("path");
var MessageAccumulator = require("message-accumulator");
var Node = require("ilib-tree-node");
var Locale = require("ilib/lib/Locale.js");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var unified = require("unified");
var markdown = require("remark-parse");
var highlight = require('remark-highlight.js');
var raw = require('rehype-raw');
var stringify = require('remark-stringify');
var frontmatter = require('remark-frontmatter');
var footnotes = require('remark-footnotes');
var he = require("he");
var unistFilter = require('unist-util-filter');
var u = require('unist-builder');
var rehype = require("rehype-parse");

// load the data for these
isAlnum._init();
isIdeo._init();

var mdparser = unified().
    use(markdown, {
        commonmark: true,
        gfm: true
    }).
    use(frontmatter, ['yaml']).
    use(footnotes).
    use(highlight).
    use(raw);

var mdstringify = unified().
    use(stringify, {
        commonmark: true,
        gfm: true,
        rule: '-',
        ruleSpaces: false,
        bullet: '*',
        listItemIndent: 1
    }).
    use(footnotes).
    use(frontmatter, ['yaml'])();

var htmlparser = unified().
    use(rehype);

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
 * Create a new Markdown file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MarkdownFile = function(options) {
    options = options || {};

    this.project = options.project;
    this.pathName = options.pathName;

    this.API = this.project.getAPI();
    this.type = options.type;
    this.logger = this.API.getLogger("loctool.lib.MarkdownFile");

    this.mapping = this.type.getMapping(this.pathName);

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.localizeLinks = false;
    // this.componentIndex = 0;
    // if this is set, only produce fully translated markdown files. Otherwise if they
    // are not fully translated, just output the original source text.
    this.fullyTranslated = this.project && this.project.settings && this.project.settings.markdown && this.project.settings.markdown.fullyTranslated;
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
MarkdownFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = he.decode(unescaped);

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
MarkdownFile.cleanString = function(string) {
    var unescaped = MarkdownFile.unescapeString(string);

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
MarkdownFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MarkdownFile.cleanString(source));
};

var reWholeTag = /<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g;

MarkdownFile.prototype._addTransUnit = function(text, comment) {
    if (text) {
        var source = this.API.utils.escapeInvalidChars(text);
        this.set.add(this.API.newResource({
            resType: "string",
            project: this.project.getProjectId(),
            key: this.makeKey(source),
            sourceLocale: this.project.sourceLocale,
            source: source,
            autoKey: true,
            pathName: this.pathName,
            state: "new",
            comment: comment,
            datatype: "markdown",
            index: this.resourceIndex++
        }));
    }
};

/**
 * @private
 * @param {Object} API
 * @param {string} text
 * @returns {Object} an object containing the leading whitespace, the text,
 * and the trailing whitespace
 */
function trim(API, text) {
    var i, pre = "", post = "", ret = {};
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
MarkdownFile.prototype.isTranslatable = function(str) {
    if (!str || !str.length || !str.trim().length) return false;

    if (!this.localizeLinks) {
        reUrl.startIndex = 0;
        var match = reUrl.exec(str);
        if (match && match.length) return false;
    }

    return this.API.utils.containsActualText(str);
}

/**
 * @param {boolean} escape true if you want the translated
 * text to be escaped for attribute values
 * @private
 */
MarkdownFile.prototype._emitText = function(escape) {
    if (!this.message.getTextLength()) {
        this.message = new MessageAccumulator();
        return;
    }

    var text = this.message.getMinimalString();

    this.logger.trace('text using message accumulator is: ' + text);

    if (this.message.isTranslatable || this.isTranslatable(text)) {
        this._addTransUnit(text, this.comment);
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

var reAttrNameAndValue = /\s(\w+)(\s*=\s*('((\\'|[^'])*)'|"((\\"|[^"])*)"))?/g;

/**
 * @private
 */
MarkdownFile.prototype._findAttributes = function(tagName, tag) {
    var match, name;

    // If this is a multiline HTML tag, the parser does not split it for us.
    // It comes as one big ole HTML tag with the open, body, and close all as
    // one. As such, we should only search the initial open tag for translatable
    // attributes.
    if (tag.indexOf('\n') > -1) {
        reWholeTag.lastIndex = 0;
        var match = reWholeTag.exec(tag);
        if (match) {
            tag = match[0];
        }
    }

    reAttrNameAndValue.lastIndex = 0;
    while ((match = reAttrNameAndValue.exec(tag)) !== null) {
        var name = match[1],
            value = (match[4] && match[4].trim()) || (match[6] && match[6].trim()) || "";
        if (value && name === "title" || (this.API.utils.localizableAttributes[tagName] && this.API.utils.localizableAttributes[tagName][name])) {
            this._addTransUnit(value);
        }
    }
}

/**
 * @private
 */
MarkdownFile.prototype._localizeAttributes = function(tagName, tag, locale, translations) {
    var match, name;
    var ret = "<" + tagName;
    var rest = "";
    var attributes = {};

    // If this is a multiline HTML tag, the parser does not split it for us.
    // It comes as one big ole HTML tag with the open, body, and close all as
    // one. As such, we should only search the initial open tag for translatable
    // attributes.
    if (tag.indexOf('\n') > -1) {
        reWholeTag.lastIndex = 0;
        var match = reWholeTag.exec(tag);
        if (match) {
            rest = tag.substring(match.index + match[0].length);
            tag = match[0];
        }
    }

    reAttrNameAndValue.lastIndex = 0;
    while ((match = reAttrNameAndValue.exec(tag)) !== null) {
        var name = match[1],
            value = (match[4] && match[4].trim()) || (match[6] && match[6].trim()) || "";
        if (value) {
            if (name === "title" || (this.API.utils.localizableAttributes[tagName] && this.API.utils.localizableAttributes[tagName][name])) {
                var translation = this._localizeString(value, locale, translations);
                attributes[name] = translation || value;
            } else {
                attributes[name] = value;
            }
        } else {
            attributes[name] = "true";
        }
    }

    for (var attr in attributes) {
        ret += " " + attr + ((attributes[attr] !== "true") ? '="' + attributes[attr] + '"' : "");
    }
    ret += '>' + rest;

    return ret;
}

var reTagName = /^<(\/?)\s*(\w+)(\s+((\w+)(\s*=\s*('((\\'|[^'])*)'|"((\\"|[^"])*)"))?)*)*(\/?)>$/;
var reSelfClosingTag = /<\s*(\w+)\/>$/;
var reL10NComment = /<!--\s*[iI]18[Nn]\s*(.*)\s*-->/;

var reDirectiveComment = /i18n-(en|dis)able\s+(\S*)/;

/**
 * @private
 * Walk the results of an HTML parse tree to convert it to the
 * markdown style of nodes.
 * @param {Node} node the current node of an abstract syntax tree to
 * walk.
 * @returns {Array.<Node>} an array of markdown nodes equivalent to
 * the given HTML node.
 */
MarkdownFile.prototype._walkHtml = function(astNode) {
    var nodes, i, trimmed, root;

    // for nodes that came from the rehype html parser, convert
    // them into one or more nodes that remark can process
    switch (astNode.type) {
        case 'comment':
            return new Node({
                type: "html",
                value: "<!--" + astNode.value + '-->'
            });

        case "element":
            nodes = [];

            // unroll the elements, as that is what markdown does
            var attrs = [];
            if (astNode.properties) {
                for (var name in astNode.properties) {
                    // for some odd reason, the "class" attribute is renamed to className by the html parser
                    // so we have to put it back again here
                    attrs.push((name === "className" ? "class" : name) + '="' + astNode.properties[name] + '"');
                }
            }
            nodes.push(new Node({
                type: "html",
                name: astNode.tagName,
                value: "<" + astNode.tagName + (attrs.length ? " " + attrs.join(" ") : "") + ">"
            }));
            if (astNode.children) {
                astNode.children.forEach(function(child) {
                    nodes = nodes.concat(this._walkHtml(child));
                }.bind(this));
            }
            nodes.push(new Node({
                type: "html",
                name: astNode.tagName,
                value: "</" + astNode.tagName + ">"
            }));
            return nodes;

        case "html":
            trimmed = astNode.value.trim();
            // ignore comment html
            if (trimmed.substring(0, 4) === '<!--') {
                break;
            }

            reTagName.lastIndex = 0;
            match = reTagName.exec(trimmed);

            if (!match) {
                // this is flow HTML that needs to be parsed into multiple nodes
                root = htmlparser.parse(astNode.value);

                if (root) {
                    if (root.type === "root") {
                        nodes = [];
                        var match = astNode.value.match(/^\s+/);
                        if (match) {
                           nodes.push(new Node({
                               type: "text",
                               value: match[0]
                           }));
                        }
                        var children = root.children;
                        if (children.length > 0) {
                            for (i = 0; i < children.length; i++) {
                                var child = children[i];
                                if (child.type === "element" &&
                                    child.tagName === "html") {
                                    var html = child.children;
                                    for (i = 0; i < html.length; i++) {
                                        var child = html[i];
                                        if (child && child.children) {
                                            child.children.forEach(function(element) {
                                                nodes = nodes.concat(this._walkHtml(element));
                                            }.bind(this));
                                        }
                                    }
                                } else {
                                    nodes = nodes.concat(this._walkHtml(child));
                                }
                            }
                        }
                        var match = astNode.value.match(/\s+$/);
                        if (match) {
                           nodes.push(new Node({
                               type: "text",
                               value: match[0]
                           }));
                        }
                        return nodes;
                    }
                } else {
                    throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                        node.position.start.line + " column " + node.position.start.column + ". Bad HTML tag.");
                }
            }
            break;

        case 'text':
            try {
                // need to to parse text nodes as markdown again, since it was never parsed before
                root = mdparser.parse(astNode.value);
                if (root) {
                    if (root.type === "root" &&
                            root.children &&
                            root.children.length &&
                            root.children[0].type === "paragraph" &&
                            root.children[0].children &&
                            root.children[0].children.length > 1) {
                        nodes = [];
                        var match = astNode.value.match(/^\s+/);
                        if (match) {
                           nodes.push(new Node({
                               type: "text",
                               value: match[0]
                           }));
                        }
                        nodes = nodes.concat(root.children[0].children);
                        var match = astNode.value.match(/\s+$/);
                        if (match) {
                           nodes.push(new Node({
                               type: "text",
                               value: match[0]
                           }));
                        }
                        return nodes;
                    } else {
                        // just plain text, so return it as-is
                        return [astNode];
                    }
                } else {
                    throw new Error("Syntax error in markdown file " + this.pathName + ". Bad markdown syntax.");
                }
            } catch (e) {
                // syntax error in markdown, just treat it like regular text
                return [new Node({
                    type: "text",
                    value: astNode.value
                })];
            }
            break;
    }

    var node = new Node(astNode);
    if (astNode.children) {
        for (i = 0; i < astNode.children.length; i++) {
            node.addChildren(this._walkHtml(astNode.children[i]));
        }
    }
    return [node];
}

/**
 * @private
 * Walk the tree looking for localizable text.
 * @param {AST} node the current node of an abstract syntax tree to
 * walk.
 */
MarkdownFile.prototype._walk = function(node) {
    var match, tagName;

    switch (node.type) {
        case 'text':
            // the message accumulator will handle the whitespace, so always
            // add this text to the accumulator even if it's just whitespace
            this.message.addText(node.value);
            this.message.isTranslatable = this.localizeLinks;
            node.localizable = true;
            break;

        case 'delete':
        case 'link':
        case 'emphasis':
        case 'strong':
            node.title && this._addTransUnit(node.title);
            if (this.localizeLinks && node.url) {
                var value = node.url;
                var parts = trim(this.API, value);
                // only localizable if there already is some localizable text
                // or if this text contains anything that is not whitespace
                if (parts.text) {
                    this._addTransUnit(node.url);
                    node.localizedLink = true;
                }
            }
            if (node.children && node.children.length) {
                this.message.push({
                    name: node.type,
                    node: node
                });
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));
                this.message.pop();

                node.localizable = node.children.every(function(child) {
                    return child.localizable;
                });
            }
            break;

        case 'image':
        case 'imageReference':
            node.title && this._addTransUnit(node.title);
            node.alt && this._addTransUnit(node.alt);
            // images are non-breaking, self-closing nodes
            // this.text += '<c' + this.componentIndex++ + '/>';
            if (this.message.getTextLength()) {
                node.localizable = true;
                this.message.push(node);
                this.message.pop();
            }
            break;

        case 'footnoteReference':
            // footnote references are non-breaking, self-closing nodes
            if (this.message.getTextLength()) {
                node.localizable = true;
                this.message.push(node, true);
                this.message.pop();
            }
            break;

        case 'definition':
            // definitions are breaking nodes
            this._emitText();
            if (node.url && this.localizeLinks) {
                var value = node.url;
                var parts = trim(this.API, value);
                // only localizable if there already is some localizable text
                // or if this text contains anything that is not whitespace
                if (parts.text) {
                    this._addTransUnit(node.url);
                    node.localizable = true;
                }
                node.title && this._addTransUnit(node.title);
            }
            break;

        case 'footnoteDefinition':
            // definitions are breaking nodes
            this._emitText();
            if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));

                node.localizable = node.children.every(function(child) {
                    return child.localizable;
                });
            }
            break;

        case 'linkReference':
            // inline code nodes and link references are non-breaking
            // Also, pass true to the push so that this node is never optimized out of a string,
            // even at the beginning or end.
            node.localizable = true;
            if (node.referenceType === "shortcut") {
                // convert to a full reference with a text child
                // so that we can have a separate label and translated title
                if (!node.children || !node.children.length) {
                    var child = new Node({
                        type: "text",
                        value: node.label,
                        children: []
                    });
                    node.children.push(child);
                }
                node.referenceType = "full";
            }
            this.message.push(node, true);
            if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));
            }
            this.message.pop();
            break;

        case 'inlineCode':
            node.localizable = true;
            this._addComment("c" + this.message.componentIndex + " will be replaced with the inline code `" + node.value + "`.");
            this.message.push(node, true);
            this.message.pop();
            break;

        case 'html':
            var trimmed = node.value.trim();
            if (trimmed.substring(0, 4) === '<!--') {
                reDirectiveComment.lastIndex = 0;
                match = reDirectiveComment.exec(node.value);
                if (match) {
                    if (match[2] === "localize-links") {
                        this.localizeLinks = (match[1] === "en");
                    }
                } else {
                    reL10NComment.lastIndex = 0;
                    match = reL10NComment.exec(node.value);
                    if (match) {
                        this._addComment(match[1].trim());
                    }
                }
                // ignore HTML comments
                break;
            }
            if (trimmed.startsWith("<script") || trimmed.startsWith("<style")) {
                // don't parse style or script tags. Just skip them.
                // They are, however, breaking tags, so emit any text
                // we have accumulated so far.
                this._emitText();
                break;
            }
            reSelfClosingTag.lastIndex = 0;
            match = reSelfClosingTag.exec(trimmed);
            if (match) {
                tagName = match[1];
                if (this.API.utils.nonBreakingTags[tagName]) {
                    this.message.push({
                        name: tagName,
                        node: node
                    });
                    node.localizable = true;
                    this.message.pop();
                } else {
                    // it's a breaking tag, so emit any text
                    // we have accumulated so far
                    this._emitText();
                }
            } else {
                reTagName.lastIndex = 0;
                match = reTagName.exec(trimmed);

                if (match) {
                    tagName = match[2];
                    if (match[1] !== '/') {
                        // opening tag
                        if (this.message.getTextLength()) {
                            if (this.API.utils.nonBreakingTags[tagName]) {
                                this.message.push({
                                    name: tagName,
                                    node: node
                                });
                                node.localizable = true;
                                if (this.API.utils.selfClosingTags[tagName]) {
                                    this.message.pop();
                                }
                            } else {
                                // it's a breaking tag, so emit any text
                                // we have accumulated so far
                                this._emitText();
                            }
                        }
                        this._findAttributes(tagName, node.value);
                    } else {
                        // closing tag
                        if (this.message.getTextLength()) {
                            if (this.API.utils.nonBreakingTags[tagName] && this.message.getCurrentLevel() > 0) {
                                var tag = this.message.pop();
                                while (tag.name !== tagName && this.message.getCurrentLevel() > 0) {
                                    tag = this.message.pop();
                                }
                                if (tag.name !== tagName) {
                                    throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                                        node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                                }
                                node.localizable = true;
                            } else {
                                this._emitText();
                            }
                        }
                    }
                } else {
                    // This is flow HTML that is not yet parsed, so parse and
                    // convert the value into an array of mdast nodes and then
                    // remove the value
                    node.children = this._walkHtml(node);
                    node.value = undefined;

                    // Morph this node into a paragraph node which is a type of container
                    // node which we can add the children to and which appears correctly
                    // in the output translated markdown
                    node.type = "paragraph";

                    // now we can rewalk this node with the new mdast tree under it to parse
                    // and extract the strings in it as we normally do
                    this._walk(node);
                }
            }
            break;

        case 'yaml':
            // parse the front matter using the YamlFile plugin
            if (this.mapping && this.mapping.frontmatter) {
                this.yamlfile.parse(node.value);
                var resources = this.yamlfile.getAll();
                if (resources) {
                    var fileNameHash = this.pathName && this.API.utils.hashKey(this.pathName);
                    resources.forEach(function(res) {
                        var modifiedResKey = res.getKey();
                        if (modifiedResKey.startsWith(fileNameHash)) {
                            modifiedResKey = modifiedResKey.substring(fileNameHash.length+1);
                        }
                        if (typeof(this.mapping.frontmatter) === 'boolean' || this.mapping.frontmatter.indexOf(modifiedResKey) > -1) {
                            this.set.add(res);
                        }
                    }.bind(this));
                }
            }
            break;

        default:
            this._emitText();
            if (node.children && node.children.length) {
                node.children.forEach(function(child, index, array) {
                    this._walk(child);
                }.bind(this));
            }
            break;
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MarkdownFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    // massage the broken headers and code blocks a bit first so that the parser
    // works as expected
    data = data.
        replace(/\[block:/g, "```\n[block:").
        replace(/\[\/block\]/g, "[/block]\n```").
        replace(/(^|\n)(#+)([^#\s])/g, "\n$2 $3").
        replace(/(^|\n)\s+```/g, "$1```").
        replace(/\n```/g, "\n\n```");

    this.ast = mdparser.parse(data);

    // accumulates characters in text segments
    // this.text = "";
    this.message = new MessageAccumulator();
    this.resourceIndex = 0;

    this._walk(this.ast);

    // in case any is left over at the end
    this._emitText();
};

/**
 * Extract all the localizable strings from the md file and add them to the
 * project's translation set.
 */
MarkdownFile.prototype.extract = function() {
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
MarkdownFile.prototype.getTranslationSet = function() {
    return this.set;
};

//we don't write Markdown source files
MarkdownFile.prototype.write = function() {};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
MarkdownFile.prototype.getOutputLocale = function(mapping, locale) {
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
MarkdownFile.prototype.getLocalizedPath = function(locale) {
    var mapping = this.mapping || this.type.getMapping(path.normalize(this.pathName)) || this.type.getDefaultMapping();
    var l = this.getOutputLocale(mapping, locale);

    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: l
    }));
};

/**
 * @private
 */
MarkdownFile.prototype._localizeString = function(source, locale, translations, nopseudo) {
    if (!source) return source;

    var key = this.makeKey(this.API.utils.escapeInvalidChars(source));
    var tester = this.API.newResource({
        type: "string",
        project: this.project.getProjectId(),
        sourceLocale: this.project.getSourceLocale(),
        reskey: key,
        datatype: "markdown"
    });
    // var hashkey = ResourceString.hashKey(this.project.getProjectId(), locale, key, "markdown");
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
                datatype: "markdown",
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
MarkdownFile.prototype._addComment = function(comment) {
    if (!this.comment) {
        this.comment = comment;
    } else {
        this.comment += " " + comment;
    }
};

/**
 * @private
 */
MarkdownFile.prototype._localizeNode = function(node, message, locale, translations) {
    var match, translation, trimmed;

    switch (node.type) {
        case 'text':
            if (node.localizable) {
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
                                throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                                    node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                            }
                        }
                    }
                } else if (node.value) {
                    var line = (node.position && node.position.start.line) || "?";
                    var column = (node.position && node.position.start.column) || "?";
                    throw new Error("Syntax error in markdown file " + this.pathName + " line " +
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

function flattenHtml(node) {
    var ret = [];

    if (node.type === "html") {
        var children = node.children;
        node.children = undefined;
        ret.push(node);
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                ret = ret.concat(flattenHtml(children[i]));
            }
            ret.push({
                type: "html",
                value: '</' + node.name + '>'
            });
        }
    } else {
        ret.push(node);
    }
    return ret;
}

function mapToAst(node) {
    var children = [];

    for (var i = 0; i < node.children.length; i++) {
        var child = mapToAst(node.children[i]);
        if (child.type === "html") {
            // flatten any HTML
            children = children.concat(flattenHtml(child));
        } else {
            children.push(child);
        }
    }
    if (node.extra) {
        if (children.length) {
            node.extra.children = node.extra.children ? node.extra.children.concat(children) : children;
        }
        return node.extra;
    }
    return u(node.type, node, children);
}

MarkdownFile.prototype._getTranslationNodes = function(locale, translations, ma) {
    if (ma.getTextLength() === 0) {
        // nothing to localize
        return undefined;
    }

    var text = ma.getMinimalString();

    var key = this.makeKey(this.API.utils.escapeInvalidChars(text));
    var translation = this._localizeString(text, locale, translations);

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

        if (this.project.settings.identify) {
            var tmp = [];
            tmp.push(new Node({
                type: "html",
                use: "start",
                name: "span",
                extra: u("html", {
                    value: '<span x-locid="' + key + '">',
                    name: "span"
                })
            }));
            tmp = tmp.concat(nodes);
            tmp.push(new Node({
                type: "html",
                use: "end",
                name: "span",
                extra: u("html", {
                    value: '</span>',
                    name: "span"
                })
            }));
            nodes = tmp;
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
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
MarkdownFile.prototype.localizeText = function(translations, locale) {
    this.resourceIndex = 0;

    this.logger.debug("Localizing strings for locale " + locale);

    // copy the ast for this locale so that we don't modify the original
    var ast = unistFilter(this.ast, function(node) {
        return true;
    });

    // flatten the tree into an array and then walk the array finding
    // localizable segments that will get replaced with the translation
    var nodeArray = mapToNodes(ast).toArray();

    var start = -1, end, ma = new MessageAccumulator();

    this.translationStatus[locale] = true;

    for (var i = 0; i < nodeArray.length; i++) {
        this._localizeNode(nodeArray[i], ma, locale, translations);

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

    if (this.fullyTranslated && this.translationStatus[locale]) {
        // record in the front matter that the file was fully translated
        if (nodeArray[1].type === "yaml") {
            nodeArray[1].value += "\nfullyTranslated: true";
        } else {
            // no front matter already, so add one
            nodeArray.splice(1, 0, new Node({
                type: "yaml",
                use: "startend",
                value: "fullyTranslated: true"
            }));
        }
    }

    // convert to a tree again
    ast = mapToAst(Node.fromArray(nodeArray));

    var str = mdstringify.stringify((!this.fullyTranslated || this.translationStatus[locale]) ? ast : this.ast);

    // make sure the thematic breaks don't have blank lines after them and they
    // don't erroneously escape the backslash chars
    str = str.
        replace(/---\n\n/g, "---\n").
        replace(/\n\n---/g, "\n---");

    return str;
};

/**
 * Localize the contents of this Markdown file and write out the
 * localized Markdown file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MarkdownFile.prototype.localize = function(translations, locales) {
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

module.exports = MarkdownFile;

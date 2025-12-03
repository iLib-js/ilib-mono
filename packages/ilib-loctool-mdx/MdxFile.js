/*
 * MdxFile.js - plugin to extract resources from an Mdx file
 *
 * Copyright © 2025, Box, Inc.
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
var he = require("he");
var unistFilter = require('unist-util-filter');
var u = require('unist-builder');

// load the data for these
isAlnum._init();
isIdeo._init();

var htmlTags;

// Lazy initialization for ESM-only remark plugins
// Latest versions of remark plugins are ESM-only, so we need to use dynamic import()
// The parser will be initialized via MdxFileType.init() which is called
// by the loctool's Project.init() method
var remark = null;
var mdparser = null;
var remarkParse = null;
var mdxPlugin = null;
var frontmatter = null;
var footnotes = null;
var mdstringify = null; // Will be initialized in initMdxParser() after ESM modules are loaded


// Initialize all ESM remark plugins
// This is called from MdxFileType.init() during project initialization
function initMdxParser(callback) {
    if (mdparser) {
        // Already initialized, call callback immediately
        if (callback) callback();
        return;
    }
    var htmlTagsJsonFile = path.join(path.dirname(require.resolve("html-tags")), "html-tags.json");
    htmlTags = JSON.parse(fs.readFileSync(htmlTagsJsonFile, "utf8"));
    
    // Load all ESM modules sequentially to avoid Jest/VM module linking issues
    // Some packages have internal dependencies that need to be linked in order
    import("remark").then(function(module) {
        remark = module.remark || module.default || module;
        return import("remark-parse");
    }).then(function(module) {
        remarkParse = module.default || module;
        return import("remark-mdx");
    }).then(function(module) {
        mdxPlugin = module.default || module;
        return import("remark-frontmatter");
    }).then(function(module) {
        frontmatter = module.default || module;
        return import("remark-gfm");
    }).then(function(module) {
        // remark-gfm includes footnotes support
        footnotes = module.default || module;
        return import("remark-stringify");
    }).then(function(module) {
        var stringifyModule = module.default || module;
        
        // remark-mdx extends remark-parse, so we need both
        // Put frontmatter AFTER mdxPlugin to avoid interfering with MDX expression parsing
        // Frontmatter processes the AST after parsing, so it should still work
        // Use remark() instead of unified() to get the base parser functionality
        // remark() includes remark-parse by default, which handles HTML tags as self-closing
        // remark-mdx extends remark-parse but replaces HTML parsing with JSX parsing
        // We need to ensure HTML is parsed before JSX. The issue is that remark-mdx
        // treats all <tags> as JSX, requiring strict XML closing. Unfortunately, there's
        // no built-in way to configure this, so we may need to accept that HTML tags
        // in MDX need to be properly closed or self-closed (<br/> or <br></br>)
        mdparser = remark().
            use(remarkParse).
            use(frontmatter, ['yaml']).
            use(mdxPlugin).
            use(footnotes);
        
        // Initialize the stringify processor as well
        // Use remark() instead of unified() to get the base compiler functionality
        // Include mdxPlugin to handle MDX-specific node types (mdxFlowExpression, mdxJsxTextElement, etc.)
        mdstringify = remark().
            use(stringifyModule, {
                commonmark: true,
                gfm: true,
                rule: '-',
                ruleSpaces: false,
                bullet: '*',
                listItemIndent: "one"
            }).
            use(mdxPlugin).
            use(footnotes).
            use(frontmatter, ['yaml'])();
        
        if (callback) callback();
    }).catch(function(err) {
        if (callback) {
            callback(err);
        } else {
            throw err;
        }
    });
}

// The init function will be exported at the end of the file


isHtmlTag = function(tag) {
    return htmlTags && htmlTags.includes(tag);
}

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
 * Create a new Mdx file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MdxFile = function(options) {
    options = options || {};

    this.project = options.project;
    this.pathName = options.pathName;

    this.API = this.project.getAPI();
    this.type = options.type;
    this.logger = this.API.getLogger("loctool.lib.MdxFile");

    this.mapping = this.type.getMapping(this.pathName);

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.localizeLinks = false;
    // this.componentIndex = 0;
    // if this is set, only produce fully translated mdx files. Otherwise if they
    // are not fully translated, just output the original source text.
    this.fullyTranslated = this.project && this.project.settings && this.project.settings.mdx && this.project.settings.mdx.fullyTranslated;
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
MdxFile.unescapeString = function(string) {
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
MdxFile.cleanString = function(string) {
    var unescaped = MdxFile.unescapeString(string);

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
MdxFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MdxFile.cleanString(source));
};

var reWholeTag = /<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g;

MdxFile.prototype._addTransUnit = function(text, comment) {
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
            datatype: "mdx",
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
MdxFile.prototype.isTranslatable = function(str) {
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
MdxFile.prototype._emitText = function(escape) {
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
MdxFile.prototype._findAttributes = function(node) {
    var match, name;

    if (!node.attributes || !node.attributes.length) {
        return;
    }

    var isJSXComponent = !isHtmlTag(node.name);

    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        if (!attr) continue;
        
        var name = attr.name;
        if (!name) continue;
        
        var value = attr.value;
        
        // In MDX/remark-mdx, attribute values can be:
        // - A string for string literals: "Click me" -> value is "Click me"
        // - An object for expressions: {variable} -> value is { type: 'mdxJsxExpressionAttribute', ... }
        // - An object with a value property: { type: 'mdxJsxAttributeValueLiteral', value: "Click me" }
        var stringValue = null;
        
        if (value === null || value === undefined) {
            // No value (boolean attribute like "disabled")
            continue;
        } else if (typeof value === 'string') {
            // Direct string value
            stringValue = value;
        } else if (typeof value === 'object') {
            // Check if it's a literal value object
            if (value.type === 'mdxJsxAttributeValueLiteral' && value.value !== undefined) {
                stringValue = value.value;
            } else if (value.value !== undefined && typeof value.value === 'string') {
                // Fallback: try value.value if it exists and is a string
                stringValue = value.value;
            } else {
                // It's likely an expression (like {variable}), skip it - expressions are not localizable
                continue;
            }
        } else {
            // Unexpected type, skip
            continue;
        }
        
        // For JSX components, only extract specific localizable attributes: title, placeholder, label
        // For HTML tags, use the configured localizableAttributes
        if (isJSXComponent) {
            // Only extract title, placeholder, and label attributes for JSX components
            if ((name === "title" || name === "placeholder" || name === "label") && 
                stringValue && typeof stringValue === 'string') {
                var trimmed = stringValue.trim();
                if (trimmed.length > 0) {
                    this._addTransUnit(trimmed);
                }
            }
        } else {
            // HTML tags: use configured localizable attributes
            if (name === "title" || (this.API.utils.localizableAttributes[node.name] && this.API.utils.localizableAttributes[node.name][name])) {
                if (stringValue && typeof stringValue === 'string') {
                    this._addTransUnit(stringValue);
                } else if (value && typeof value === 'string') {
                    this._addTransUnit(value);
                }
            }
        }
    }
}

/**
 * @private
 * Localize JSX attributes in a node during the localization phase.
 */
MdxFile.prototype._localizeJsxAttributes = function(node, locale, translations) {
    if (!node.attributes || !node.attributes.length) {
        return;
    }

    var isJSXComponent = !isHtmlTag(node.name);

    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        var name = attr.name;
        var value = attr.value;
        
        // In MDX, string attribute values might be stored as:
        // - A string directly: "Click me"
        // - A literal object with a value property: { type: 'mdxJsxAttributeValueLiteral', value: "Click me" }
        var stringValue = value;
        var isLiteralObject = false;
        if (value && typeof value === 'object' && value.value !== undefined) {
            stringValue = value.value;
            isLiteralObject = true;
        }
        
        // For JSX components, only localize specific attributes: title, placeholder, label
        // For HTML tags, use the configured localizableAttributes
        if (isJSXComponent) {
            // Only localize title, placeholder, and label attributes for JSX components
            if ((name === "title" || name === "placeholder" || name === "label") &&
                stringValue && typeof stringValue === 'string' && stringValue.trim()) {
                var translated = this._localizeString(stringValue, locale, translations);
                if (isLiteralObject) {
                    attr.value.value = translated;
                } else {
                    attr.value = translated;
                }
            }
        } else {
            // HTML tags: use configured localizable attributes
            if (name === "title" || (this.API.utils.localizableAttributes[node.name] && this.API.utils.localizableAttributes[node.name][name])) {
                if (stringValue && typeof stringValue === 'string') {
                    var translated = this._localizeString(stringValue, locale, translations);
                    if (isLiteralObject) {
                        attr.value.value = translated;
                    } else {
                        attr.value = translated;
                    }
                } else if (value && typeof value === 'string') {
                    attr.value = this._localizeString(value, locale, translations);
                }
            }
        }
    }
}

/**
 * @private
 */
MdxFile.prototype._localizeAttributes = function(tagName, tag, locale, translations) {
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
var reL10NComment = /\/\*\s*[iI]18[Nn]\s*(.*)\s*\*\//;

var reDirectiveComment = /i18n-(en|dis)able\s+(\S*)/;

/**
 * @private
 * Walk the tree looking for localizable text.
 * @param {AST} node the current node of an abstract syntax tree to
 * walk.
 */
MdxFile.prototype._walk = function(node) {
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

        case 'root':
            // root node just contains children, don't emit text
            if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));
            }
            break;

        case 'mdxFlowExpression':
            var trimmed = node.value ? node.value.trim() : '';
            if (trimmed.substring(0, 2) === '/*') {
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
            } else if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));
            }
            break;

        case 'mdxTextExpression':
            // inline JavaScript expressions like {variable} or {1 + 1}
            // treat like inline code - non-breaking, self-closing node
            node.localizable = true;
            this._addComment("c" + this.message.componentIndex + " will be replaced with the inline expression {" + (node.value || '') + "}.");
            this.message.push(node, true);
            this.message.pop();
            break;

        case 'mdxjsEsm':
            // ES Module import/export statements - breaking node, no translatable content
            this._emitText();
            // no children to walk, just the value which is code
            break;

        case 'mdxJsxTextElement':
        case 'mdxJsxFlowElement':
            // Handle both inline and block-level JSX/HTML elements
            var isFlowElement = (node.type === 'mdxJsxFlowElement');
            var trimmed = node.name;
            
            // Block-level JSX elements are always breaking nodes
            if (isFlowElement) {
                this._emitText();
            }
            
            if (!isHtmlTag(trimmed)) {
                // this is a JSX component
                if (!isFlowElement) {
                    // Inline JSX components participate in text flow
                    this.message.push({
                        name: tagName,
                        node: node
                    });
                    node.localizable = true;
                }
                // Extract JSX component props
                // Check for attributes in multiple possible locations
                if (node.attributes && node.attributes.length > 0) {
                    this._findAttributes(node);
                } else if (node.data && node.data.attributes) {
                    // Some MDX parsers might store attributes in node.data
                    node.attributes = node.data.attributes;
                    this._findAttributes(node);
                }
                if (node.children && node.children.length) {
                    node.children.forEach(function(child) {
                        this._walk(child);
                    }.bind(this));
                }
                if (!isFlowElement) {
                    this.message.pop();
                }
            } else {
                // HTML tag
                if (!isFlowElement && this.message.getTextLength()) {
                    if (this.API.utils.nonBreakingTags[trimmed]) {
                        this.message.push({
                            name: trimmed,
                            node: node
                        });
                        node.localizable = true;
                    } else {
                        // it's a breaking tag, so emit any text
                        // we have accumulated so far and then search the children
                        this._emitText();
                    }
                }
                if (node.children && node.children.length) {
                    node.children.forEach(function(child) {
                        this._walk(child);
                    }.bind(this));
                }

                if (!isFlowElement && node.localizable) {
                    // only need to pop if we're parsing a non-breaking tag
                    this.message.pop();
                }
                this._findAttributes(node);
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
MdxFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    // Ensure remark-mdx parser is loaded (for ESM-only package)
    // The parser should be initialized via MdxFileType.init() before parse() is called
    if (!mdparser) {
        throw new Error("remark-mdx parser not initialized. The parser must be initialized via MdxFileType.init() " +
            "before calling parse(). This should happen automatically during project initialization.");
    }

    // massage the broken headers and code blocks a bit first so that the parser
    // works as expected
    data = data.
        replace(/\[block:/g, "```\n[block:").
        replace(/\[\/block\]/g, "[/block]\n```").
        replace(/(^|\n)(#+)([^#\s])/g, "\n$2 $3").
        replace(/(^|\n)\s+```/g, "$1```").
        replace(/\n```/g, "\n\n```");

    // Pre-process script and style tags to prevent parsing errors
    // remark-mdx tries to parse {} as JSX expressions, which causes errors
    // when script/style tags contain JavaScript/CSS with curly braces.
    // We escape curly braces and angle brackets to prevent JSX/HTML parsing.
    // Store original content separately for script and style tags
    this._scriptRestore = [];
    
    // Replace script and style tags: escape curly braces and angle brackets to prevent parsing
    data = data.replace(/<script[^>]*>([\s\S]*?)<\/script>|<style[^>]*>([\s\S]*?)<\/style>/gi, function(match, content) {
        // Escape curly braces (JSX expressions) and angle brackets (HTML tags) to prevent parsing
        var escapedContent = "{/* " + match + " */}";
        this._scriptRestore.push(match);
        return escapedContent;
    }.bind(this));

    try {
        this.ast = mdparser.parse(data);
    } catch (e) {
        this.logger.error("Failed to parse file " + this.pathName + "\nException: " + e);
        throw e;
    }

    // Debug: log AST structure to help diagnose parsing issues
    if (this.logger.isTraceEnabled()) {
        this.logger.trace("AST root type: " + (this.ast && this.ast.type));
        if (this.ast && this.ast.children) {
            this.ast.children.forEach(function(child, i) {
                this.logger.trace("AST child " + i + ": type=" + child.type + 
                    (child.value ? ", value=" + JSON.stringify(child.value.substring(0, 50)) : "") +
                    (child.children ? ", children=" + child.children.length : ""));
                // Log children of children for deeper inspection
                if (child.children && child.type !== 'yaml') {
                    child.children.forEach(function(grandchild, j) {
                        this.logger.trace("  Child " + i + "." + j + ": type=" + grandchild.type + 
                            (grandchild.value ? ", value=" + JSON.stringify(grandchild.value.substring(0, 50)) : ""));
                    }.bind(this));
                }
            }.bind(this));
        }
    }

    // accumulates characters in text segments
    // this.text = "";
    this.message = new MessageAccumulator();
    this.resourceIndex = 0;

    this._walk(this.ast);

    // in case any is left over at the end
    this._emitText();
};

/**
 * Extract all the localizable strings from the mdx file and add them to the
 * project's translation set.
 */
MdxFile.prototype.extract = function() {
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
MdxFile.prototype.getTranslationSet = function() {
    return this.set;
};

//we don't write Mdx source files
MdxFile.prototype.write = function() {};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
MdxFile.prototype.getOutputLocale = function(mapping, locale) {
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
MdxFile.prototype.getLocalizedPath = function(locale) {
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
MdxFile.prototype._localizeString = function(source, locale, translations, nopseudo) {
    if (!source) return source;

    var key = this.makeKey(this.API.utils.escapeInvalidChars(source));
    var tester = this.API.newResource({
        type: "string",
        project: this.project.getProjectId(),
        sourceLocale: this.project.getSourceLocale(),
        reskey: key,
        datatype: "mdx"
    });
    // var hashkey = ResourceString.hashKey(this.project.getProjectId(), locale, key, "mdx");
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
                datatype: "mdx",
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
MdxFile.prototype._addComment = function(comment) {
    if (!this.comment) {
        this.comment = comment;
    } else {
        this.comment += " " + comment;
    }
};

/**
 * @private
 */
MdxFile.prototype._localizeNode = function(node, message, locale, translations) {
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

        case 'mdxJsxTextElement':
        case 'mdxJsxFlowElement':
            // Handle both inline and block-level JSX/HTML elements
            // Both types handle attributes the same way during localization
            var trimmed = node.name;
            // Localize attributes for both HTML tags and JSX components
            if (trimmed && node.attributes) {
                this._localizeJsxAttributes(node, locale, translations);
            }
            // Only inline elements (mdxJsxTextElement) participate in message push/pop
            // Block-level elements (mdxJsxFlowElement) are breaking nodes and don't affect inline text flow
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else if (node.use === "end") {
                    message.pop();
                } else {
                    message.push(node);
                    message.pop();
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

        case 'mdxFlowExpression':
            if (!node.value) {
                // container node, don't need to do anything for this one
                break;
            }
            trimmed = node.value.trim();
            if (trimmed.substring(0, 2) === '/*') {
                reL10NComment.lastIndex = 0;
                match = reL10NComment.exec(node.value);
                if (match) {
                    this._addComment(match[1].trim());
                }
            }
            break;

        case 'mdxTextExpression':
            // inline JavaScript expressions - non-breaking, self-closing node
            if (node.localizable) {
                message.push(node, true);
                message.pop();
            }
            break;

        case 'mdxjsEsm':
            // ES Module import/export statements - no localization needed
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
        // Don't flatten JSX elements - keep them as proper tree structure
        // The stringifier will handle them correctly
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

MdxFile.prototype._getTranslationNodes = function(locale, translations, ma) {
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
                type: "mdxJsxTextElement",
                use: "start",
                name: "span",
                extra: u("mdxJsxTextElement", {
                    value: '<span x-locid="' + key + '">',
                    name: "span"
                })
            }));
            tmp = tmp.concat(nodes);
            tmp.push(new Node({
                type: "mdxJsxTextElement",
                use: "end",
                name: "span",
                extra: u("mdxJsxTextElement", {
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
MdxFile.prototype.localizeText = function(translations, locale) {
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

    // Restore original content in script and style tags
    // Replace escaped content with original content in order
    var scriptIndex = 0;
    str = str.replace(/\{\/\* (<script[^>]*>([\s\S]*?)<\/script>|<style[^>]*>([\s\S]*?)<\/style>) \*\/\}/gi, function(match, content) {
        if (scriptIndex < this._scriptRestore.length) {
            var original = this._scriptRestore[scriptIndex];
            scriptIndex++;
            return original;
        }
        return match;
    }.bind(this));

    return str;
};

/**
 * Localize the contents of this Mdx file and write out the
 * localized Mdx file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MdxFile.prototype.localize = function(translations, locales) {
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

// Export the init function so MdxFileType can call it
MdxFile.initMdxParser = initMdxParser;

// Export a function to check if parser is initialized (for testing)
MdxFile.isParserInitialized = function() {
    return mdparser !== null;
};

module.exports = MdxFile;

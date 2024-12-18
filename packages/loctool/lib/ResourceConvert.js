/*
 * ResourceConvert.js - functions to convert between resource types
 *
 * Copyright © 2024 Box, Inc.
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

var ResourceString = require("./ResourceString.js");
var ResourcePlural = require("./ResourcePlural.js");
var IntlMessageFormat = require("intl-messageformat").IntlMessageFormat;

function getPluralCategories(plurals) {
    if (!plurals) return "";
    return Object.keys(plurals).map(function(category) {
        return `${category} {${plurals[category]}}`;
    }).join(" ");
}

/**
 * Enum for the type of node in an AST, as defined by the IntlMessageFormat `declare enum TYPE`.
 * Source: formatjs/icu-messageformat-parser/types.d.ts: 6
 *
 * @private
 * @readonly
 * @enum {number}
 */

const NodeType = {
    'literal': 0,
    'argument': 1,
    'number': 2,
    'date': 3,
    'time': 4,
    'select': 5,
    'plural': 6,
    'pound': 7,
    'tag': 8,
}

/**
 * Reconstruct the string that this node in an AST represents.
 *
 * @private
 * @param {Node} node the node to reconstruct
 * @returns {string} the reconstructed string
 */
function reconstructString(node) {
    if (Array.isArray(node)) {
        return node.map(reconstructString).join('');
    }

    switch (node.type) {
        case NodeType.literal:
            return node.value;
        case NodeType.argument:
            return "{" + node.value + "}";
        case NodeType.number:
            return "{" + node.value + ", number}";
        case NodeType.date:
            return "{" + node.value + ", date}";
        case NodeType.time:
            return "{" + node.value + ", time}";
        case NodeType.select: {
            const options = Object.entries(node.options).map(function (entry) {
                return entry[0] + " {" + reconstructString(entry[1].value) + "}";
            }).join(' ');

            return "{" + node.value + ", select, " + options + "}";
        }
        case NodeType.plural: {
            const options = Object.entries(node.options).map(entry => `${entry[0]} {${reconstructString(entry[1].value)}}`).join(' ');

            return "{" + node.value + ", plural, " + options + "}";
        }
        case NodeType.tag:
            const children = reconstructString(node.children);

            return "<" + node.value + ">" + children + "</" + node.value + ">";
        default:
            throw new Error('Unsupported AST node type: ' + node.type);
    }
}

/**
 * Convert a plural resource to an ICU-style plural string resource.
 * This allows for shoe-horning plurals into systems that do not
 * support plurals, or at least don't offer a way to import them
 * properly. All other fields are copied from the plural resource
 * parameter into the returned resource string unchanged.
 * The complement function is convertICUToPluralRes() which does
 * the opposite.
 *
 * @param {ResourcePlural} resource the resource to convert into an
 * ICU-style plural resource string
 * @param {ResourceString} the plural resource converted into a
 * string resource
 */
module.exports.convertPluralResToICU = function(resource) {
    if (resource.getType() === "plural") {
        var targetPlurals = resource.getTargetPlurals();
        return new ResourceString({
            key: resource.getKey(),
            sourceLocale: resource.getSourceLocale(),
            source: `{count, plural, ${getPluralCategories(resource.getSourcePlurals())}}`,
            targetLocale: resource.getTargetLocale(),
            target: targetPlurals ? `{count, plural, ${getPluralCategories(targetPlurals)}}` : undefined,
            project: resource.getProject(),
            pathName: resource.getPath(),
            datatype: resource.getDataType(),
            flavor: resource.getFlavor(),
            comment: resource.getComment(),
            state: resource.getState()
        });
    }
    return undefined;
};

/**
 * Convert a an ICU-style plural string resource into plural resource.
 * This allows for shoe-horning plurals into systems that do not
 * support plurals, or at least don't offer a way to export them
 * properly. All other fields are copied from the string resource
 * parameter into the returned resource plural unchanged.
 * The complement function is convertPluralResToICU() which does
 * the opposite.
 *
 * @param {ResourceString} resource the ICU-style plural resource string
 * to convert into a plural resource
 * @param {ResourcePlural} the resource string converted into a
 * plural resource
 */
module.exports.convertICUToPluralRes = function(resource) {
    if (resource.getType() === "string") {
        try {
            var i, opts;
            var imf = new IntlMessageFormat(resource.getSource(), resource.getSourceLocale());
            var ast = imf.getAst();
            var sources = {};
            var foundPlural = false;
            for (i = 0; i < ast.length; i++) {
                if (ast[i].type === NodeType.plural) {
                    foundPlural = true;
                    opts = ast[i].options;
                    if (opts) {
                        Object.keys(opts).forEach(function(category) {
                            sources[category] = reconstructString(opts[category].value);
                        });
                    }
                }
            }

            if (!foundPlural) {
                // this is a regular non-plural string, so don't convert anything
                return undefined;
            }
            var targetString = resource.getTarget();
            var targets;
            if (targetString) {
                imf = new IntlMessageFormat(resource.getTarget(), resource.getTargetLocale());
                var ast = imf.getAst();
                targets = {};
                for (i = 0; i < ast.length; i++) {
                    opts = ast[i].options;
                    if (opts) {
                        Object.keys(opts).forEach(function(category) {
                            targets[category] = reconstructString(opts[category].value);
                        });
                    }
                }
            }
            return new ResourcePlural({
                key: resource.getKey(),
                sourceLocale: resource.getSourceLocale(),
                sourcePlurals: sources,
                targetLocale: resource.getTargetLocale(),
                targetPlurals: targets,
                project: resource.getProject(),
                pathName: resource.getPath(),
                datatype: resource.getDataType(),
                flavor: resource.getFlavor(),
                comment: resource.getComment(),
                state: resource.getState()
            });
        } catch (e) {
            console.log(e);
        }
    }
    return undefined;
};


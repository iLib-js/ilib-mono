/*
 * ResourceConvert.js - functions to convert between resource types
 *
 * Copyright © 2024-2025 Box, Inc.
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

import ResourceString from "./ResourceString.js";
import ResourcePlural from "./ResourcePlural.js";
import { IntlMessageFormat } from "intl-messageformat";

/**
 * Convert the plural categories in a plural resource to an ICU-style
 * plural string resource.
 * @example
 * if plurals is {
 *   "one": "# item",
 *   "other": "# items"
 * }
 * then this function returns the string:
 *   "one {# item} other {# items}"
 * @private
 * @param {Object} plurals the plural categories to convert
 * @returns {String} the plural categories in ICU-style
 */
function getPluralCategories(plurals) {
    if (!plurals) return "";
    return Object.keys(plurals).map(category => {
        return `${category} {${plurals[category]}}`;
    }).join(" ");
}

/**
 * Calculate the depth of a tree. See the jsdoc for constructPluralTree()
 * for a discussion of plural trees.
 * @private
 * @param {Object} tree the tree to calculate the depth
 * @returns {Number} the depth of the tree
 */
function treeDepth(tree) {
    if (!tree || typeof(tree) !== 'object') return 0;

    let maxDepth = 0;
    for (let category in tree) {
        maxDepth = Math.max(maxDepth, treeDepth(tree[category]));
    }
    return maxDepth + 1;
}

/**
 * Convert a plural tree and an array of pivots into an ICU-style plural string.
 * @example
 * if the plural tree is {
 *   "one": {
 *     "one": "{f} file {d} directory",
 *     "other": "{f} file {d} directories"
 *   },
 *   "other": {
 *     "one": "{f} files {d} directory",
 *     "other": "{f} files {d} directories"
 *   }
 * }
 * and the pivots are `["f", "d"]` then this function returns the string:
 *   "{f, plural, one {{d, plural, one {{f} file {d} directory} other {{f} file {d} directories}}} other {{d, plural, one {{f} files {d} directory} other {{f} files {d} directories}}}}"
 * @private
 * @param {Object|undefined} pluralTree the plural tree to convert
 * @param {Array<String>} pivots the pivot variable names of levels of the tree
 * @returns {String|undefined} the ICU-style plural string, or undefined if the plural
 * tree is not defined
 */
function getPluralString(pluralTree, pivots) {
    if (!pluralTree) return undefined;

    let currentTree = pluralTree;
    if (treeDepth(pluralTree) > 1) {
        const subpivots = pivots?.slice(1);
        currentTree = {};
        for (let category in pluralTree) {
            currentTree[category] = getPluralString(pluralTree[category], subpivots);
        }
    }
    const pivot = pivots?.[0] ?? "count";
    return `{${pivot}, plural, ${getPluralCategories(currentTree)}}`;
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
};

/**
 * Reconstruct the string that this node in an AST represents.
 * Formatjs does not publish a function that does this, so we
 * have to reconstruct it ourselves.
 *
 * @private
 * @param {Node | Node[]} node the node to reconstruct
 * @returns {string} the reconstructed string
 */
function reconstructString(node) {
    if (Array.isArray(node)) {
        return node.map(reconstructString).join('');
    }

    switch (node.type) {
        case NodeType.pound:
            return '#';
        case NodeType.literal:
            return node.value;
        case NodeType.argument:
            return `{${node.value}}`;
        case NodeType.number:
            return `{${node.value}, number}`;
        case NodeType.date:
            return `{${node.value}, date}`;
        case NodeType.time:
            return `{${node.value}, time}`;
        case NodeType.select: {
            const options = Object.entries(node.options).
                map(entry => `${entry[0]} {${reconstructString(entry[1].value)}}`).join(' ');

            return `{${node.value}, select, ${options}}`;
        }
        case NodeType.plural: {
            const options = Object.entries(node.options).
                map(entry => `${entry[0]} {${reconstructString(entry[1].value)}}`).join(' ');

            return `{${node.value}, plural, ${options}}`;
        }
        case NodeType.tag:
            const children = reconstructString(node.children);

            return `<${node.value}>${children}</${node.value}>`;
        default:
            throw new Error(`Unsupported AST node type: ${node.type}`);
    }
}

/**
 * Construct a tree of plural choices from a set of plural choices. A
 * plural tree is an intermediate representation of the choices that
 * are available in a multi-key plural resource.
 *
 * It is structured like this:
 * - the top level is the first plural category for the first pivot variable
 * - the second level is the second plural category for second pivot variable
 * - [etc]
 * - the leafs the string for that plural category combination
 *
 * This works properly for any number of pivot variables, including if there
 * are zero or one. The plural tree is used to generate an ICU-style plural
 * string.
 *
 * @example
 * if the set of choices are {
 *   "one,one": "{f} file {d} directory",
 *   "one,other": "{f} file {d} directories",
 *   "other,one": "{f} files {d} directory",
 *   "other,other": "{f} files {d} directories"
 * }
 * Then this function returns the tree:
 * {
 *   "one": {
 *     "one": "{f} file {d} directory",
 *     "other": "{f} file {d} directories"
 *   },
 *   "other": {
 *     "one": "{f} files {d} directory",
 *     "other": "{f} files {d} directories"
 *   }
 * }
 * @private
 * @param {Object|undefined} choices the plurals (either source or target)
 * from a ResourcePlural instance
 * @returns {Object|undefined} the plural tree, or undefined if the source
 * choices are not defined
 */
function constructPluralTree(choices) {
    if (!choices) return undefined;

    let tree = {};
    let i, category;

    for (category in choices) {
        if (choices.hasOwnProperty(category)) {
            const categories = category.split(',');
            let current = tree;
            for (i = 0; i < categories.length-1; i++) {
                const cat = categories[i];
                if (!current[cat]) {
                    current[cat] = {};
                }
                current = current[cat];
            }
            current[categories[categories.length-1]] = choices[category];
        }
    }

    return tree;
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
 * @example
 * if plural resource has source plurals like this:
 * {
 *   "one": "# item",
 *   "other": "# items"
 * }
 * and the pivot variable name is "count", then this function returns
 * a ResourceString instance that contains the string:
 *   "{count, plural, one {# item} other {# items}}"
 *
 * @param {ResourcePlural} resource the resource to convert into an
 * ICU-style plural resource string
 * @returns {ResourceString|undefined} the plural resource converted into a
 * string resource, or undefined if the resource is not a plural resource
 */
export function convertPluralResToICU(resource) {
    if (resource.getType() === "plural") {
        const source = resource.getSource();
        const target = resource.getTarget();
        const pivots = resource.getPivots();
        return new ResourceString({
            key: resource.getKey(),
            sourceLocale: resource.getSourceLocale(),
            source: getPluralString(constructPluralTree(source), pivots),
            targetLocale: resource.getTargetLocale(),
            target: getPluralString(constructPluralTree(target), pivots),
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
 * Distribute non-plural nodes in an AST into the inside of plural nodes.
 * Some plural strings contain a part that is outside of the plural and a part
 * that is inside of the plural. eg. "There {count, plural, one {is # item} other {are # items}}."
 *
 * This kind of string makes it more difficult for translators
 * to translate properly in all of the plural cases because they have to put it
 * the whole string together mentally for each plural category. Translators are not
 * programmers, so the ICU plural syntax is often confusing for them. Also, it may be
 * valid grammatically to put certain parts of a sentence outside of the plural in English
 * but not in other languages. The English-speaking engineer who wrote the string
 * may not even be aware that in some languages, the parts they have put outside
 * of the plural are also grammatically affected by the plurality of the pivot variable.
 *
 * This function takes an AST and distributes the non-plural nodes inside the plural
 * nodes so that the plural choices end up being whole sentences or phrases. This allows
 * translators to see the whole sentence or phrase for each plural category and translate
 * all of the parts of the sentence properly, including the parts that the English-speaking
 * engineer did not realize would be important to the translator.
 *
 * Another affect of representing the string with the plurals "on the outside" is that
 * it is easier to represent the plural choices in a translation system that does
 * not support plurals at all. Each plural choice can be sent for translation as an
 * independent, whole string. After translation, the independent plural choice strings
 * can be recombined to form the full set of plural strings for the target locale encoded
 * in a single ResourcePlural instance. From there, it can be converted into an ICU
 * style plural in a string resource using convertPluralResToICU().
 *
 * This function will perform this distribution recursively on the AST in case
 * there are nested or multiple plural nodes. The end result is that all of the
 * plural nodes in a tree are pushed up to the root, and the text and other
 * nodes are pushed down to the leaves.
 *
 * After translation, the structure of the AST may be very different from the original
 * English source string, but it should be functionally equivalent from the software
 * user's perspective. They will see properly translated plurals in the user interface.
 *
 * @example If the source string is,
 *   "By clicking 'Accept', you agree to delete {count, plural, one {# item} other {# items}}."
 * Some languages may need to have plurality agreement between the verb "delete" and the number
 * of items. In to translate that properly in all languages, the source string should be reworked to,
 *   "{count, plural, one {By clicking 'Accept', you agree to delete # item.} other {By clicking 'Accept', you agree to delete # items.}}"
 * That is, the non-plural part of the string is distributed into the plural nodes such that
 * a plural node is the root of the AST. That way, the translator can translate the whole string
 * for each plural case and use the proper plurality agreement in the verb if necessary.
 *
 * @private
 * @param {Node | Node[]} node the AST to distribute
 * @returns {Node | Node[]} the distributed AST
 */
function distributePlurals(node) {
    let i, opts;

    let output = node;
    if (Array.isArray(node)) {
        for (i = 0; i < node.length; i++) {
            if (node[i].type === NodeType.plural) {
                // This is a plural node, so distribute anything before and after it into the plural nodes.
                // Doesn't matter what type of nodes these are.
                const preNodes = node.slice(0, i);
                const postNodes = node.slice(i + 1);
                const originalOpts = node[i].options;
                const pivot = node[i].value ?? "count";
                opts = {};
                for (let pluralCategory in originalOpts) {
                    let optionValue = originalOpts[pluralCategory].value;
                    if (Array.isArray(optionValue)) {
                        optionValue = [...preNodes, ...optionValue, ...postNodes];
                    } else {
                        optionValue = [...preNodes, optionValue, ...postNodes];
                    }
                    // make sure to convert the pound nodes to argument nodes so that we can disambiguate them
                    optionValue = optionValue.map(node => {
                        if (node.type === NodeType.pound) {
                            // use the name of the last pivot as the argument name
                            return { type: NodeType.argument, value: pivot };
                        }
                        return node;
                    });
                    // also distribute the option value in case there are nested plural nodes.
                    opts[pluralCategory] = {
                        value: distributePlurals(optionValue)
                    };
                }
                output = {
                    type: node[i].type,
                    offset: node[i].offset,
                    options: opts,
                    pluralType: node[i].pluralType,
                    value: pivot
                };
                break;
            }
        }
    }

    return output;
}

/**
 * Get the name of the pivot variables of all of the plural AST node at the
 * root of the tree. These are listed in the array in the order that they
 * appear in the AST.
 *
 * @private
 * @param {Node|Node[]} node the AST node to get the pivot variables from
 * @returns {Array<String>} the pivot variables
 */
function getPivots(node) {
    const firstNode = Array.isArray(node) ? node[0] : node;
    if (firstNode.type === NodeType.plural) {
        return [firstNode.value, ...getPivots(firstNode.options.other.value)];
    }
    return [];
}

/**
 * Convert nested plural nodes into a set of possibly multi-key
 * plural choices. It is assumed that the top level of the AST is a plural
 * node which is the output of the distribute() function above.
 *
 * For one-level plurals, this function will return an object with a key for
 * each plural category. The value for each key will be the plural string
 * for that category.
 *
 * If there are nested plural nodes, the function will return an object with
 * a multi-key for each plural category. The value for each multi-key will be
 * the plural string for that combination of categories.
 *
 * @private
 * @param {Node | Node[]} ast the AST to convert
 * @param {String|undefined} pivot the pivot variable of the parent node
 * @param {Array<String>} categories the plural categories of all parent nodes of the current node
 * @returns {Object} the converted plural choices
 */
function convertASTToPluralChoices(ast, pivot = undefined, categories = []) {
    let opts;
    let choices = {};

    if (!Array.isArray(ast)) {
        ast = [ast];
    }

    if (ast.length === 1 && ast[0].type === NodeType.plural) {
        // this is a plural node, so convert it recursively
        opts = ast[0].options;
        for (let pluralCategory in opts) {
            const newChoices = convertASTToPluralChoices(opts[pluralCategory].value, ast[0].value, [...categories, pluralCategory]);
            choices = { ...choices, ...newChoices };
        }
    } else {
        // leaf node, so add it to the choices directly using the multi-key syntax
        const category = categories.join(',');
        choices[category] = reconstructString(ast);
    }

    return choices;
}

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
 * @returns {ResourcePlural|undefined} the resource string converted into a
 * plural resource, or undefined if the resource is not a string resource
 */
export function convertICUToPluralRes(resource) {
    if (resource.getType() === "string") {
        try {
            let i;
            let imf = new IntlMessageFormat(resource.getSource(), resource.getSourceLocale());
            let ast = imf.getAst();
            let foundPlural = false;

            for (i = 0; i < ast.length; i++) {
                if (ast[i].type === NodeType.plural) {
                    foundPlural = true;
                    break;
                }
            }

            if (!foundPlural) {
                // this is a regular non-plural string, so don't convert anything
                return undefined;
            }

            // distribute the plural nodes to make it easier for translators to translate
            ast = distributePlurals(ast);
            const sourceChoices = convertASTToPluralChoices(ast);
            const pivots = getPivots(ast);

            let targetChoices = undefined;
            const target = resource.getTarget();
            if (target) {
                imf = new IntlMessageFormat(target, resource.getTargetLocale());
                ast = imf.getAst();
                ast = distributePlurals(ast);
                targetChoices = convertASTToPluralChoices(ast);
            }

            return new ResourcePlural({
                key: resource.getKey(),
                sourceLocale: resource.getSourceLocale(),
                source: sourceChoices,
                targetLocale: resource.getTargetLocale(),
                target: targetChoices,
                project: resource.getProject(),
                pathName: resource.getPath(),
                datatype: resource.getDataType(),
                flavor: resource.getFlavor(),
                comment: resource.getComment(),
                state: resource.getState(),
                pivots
            });
        } catch (e) {
            console.log(e);
        }
    }
    return undefined;
};


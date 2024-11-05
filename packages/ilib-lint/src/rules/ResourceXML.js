/*
 * ResourceXML.js - rule to check that XML in the translations match
 * XML in the source
 *
 * Copyright © 2024 JEDLSoft
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

import { Result } from 'ilib-lint-common';
import { xml2js } from 'xml-js';
import { selfClosingTags } from 'ilib-tools-common';
import ResourceRule from './ResourceRule.js';

const htmlTags = Object.keys(selfClosingTags).concat(["p", "li"]);
const selfClosingRe = new RegExp(`<(${htmlTags.join('|')})>`, "g");
const endTagRe = new RegExp(`</(${htmlTags.join('|')})>`);
const unnamedTagRe = /<\/?>/;

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceXML extends ResourceRule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-xml";
        this.description = "Ensure that XML in translated resources match the source";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-xml.md";
    }

    /**
     * @private
     * @param {Node} node a node in the AST
     * @param {Object} elements an object that maps each element found to the number of times it
     * has been found
     */
    countElements(node, elements) {
        if (Array.isArray(node)) {
            for (let i in node) {
                this.countElements(node[i], elements);
            }
        } else {
            if (node.type === "element") {
                if (!elements[node.name]) {
                    elements[node.name] = 1;
                } else {
                    elements[node.name]++;
                }
            }
            if (node.elements) {
                this.countElements(node.elements, elements);
            }
        }
    }

    /**
     * @private
     * @param {Node} sourceAst the root of the AST of the source string
     * @param {Node} targetAst the root of the AST of the target string
     * @param {Resource} resource the resource instance where the source
     * and target strings came from
     */
    matchElements(sourceAst, targetAst, resource) {
        // first traverse the source tree looking for elements to count
        let sourceElements = {}, targetElements = {};
        let problems = [];

        if (sourceAst?.elements?.length > 0) {
            this.countElements(sourceAst?.elements, sourceElements);
            if (targetAst?.elements?.length > 0) {
                this.countElements(targetAst?.elements, targetElements);
            }

            for (let element in sourceElements) {
                if (!targetElements[element] || sourceElements[element] !== targetElements[element]) {
                    let opts = {
                        severity: "error",
                        rule: this,
                        description: `The number of XML <${element}> elements in the target (${targetElements[element] ?? 0}) does not match the number in the source (${sourceElements[element]}).`,
                        id: resource.getKey(),
                        highlight: `Target: ${resource.getTarget()}<e0/>`,
                        pathName: resource.getPath(),
                        source: resource.getSource(),
                        locale: resource.getTargetLocale()
                    };
                    problems.push(new Result(opts));
                }
            }

            for (let element in targetElements) {
                if (!sourceElements[element]) {
                    const re = new RegExp(`<(?<tag>\/?${element}\/?)>`, "g");
                    const highlight =
                        resource.getTarget().replace(re, "<e0><$<tag>></e0>");
                    let opts = {
                        severity: "error",
                        rule: this,
                        description: `The XML element <${element}> in the target does not appear in the source.`,
                        id: resource.getKey(),
                        highlight: `Target: ${highlight}`,
                        pathName: resource.getPath(),
                        source: resource.getSource(),
                        locale: resource.getTargetLocale()
                    };
                    problems.push(new Result(opts));
                }
            }
        }

        return problems;
    }

    /**
     * Sometimes, the xml tags are really html, which has notorious problems
     * with unclosed tags being considered valid, such as the <p> or
     * <br> tags. The xml parser we are using does not recognize html,
     * so we have to convert the unclosed html tags into valid xml before we
     * attempt to parse them. This function does that by making those tags into
     * self-closing tags. <p> becomes <p/>
     *
     * Note that if there is a <p> tag, we have to make sure there is also no
     * </p> in the string as that is valid xml already. We should only convert
     * the <p> tags when there are no </p> tags to go with it.
     *
     * @private
     * @param {string} string the string to convert
     * @returns {string}
     */
    convertUnclosedTags(string) {
        let converted = string;

        if (!endTagRe.test(string)) {
            converted = string.replace(selfClosingRe, "<$1/>");
        }
        return converted;
    }

    /**
     * @override
     */
    matchString({source, target, resource}) {
        if (!target) return; // can't check "nothing" !
        let srcObj, tgtObj;
        let problems = [];
        const prefix = '<?xml version="1.0" encoding="UTF-8"?><root>';
        const suffix = '</root>';

        // convert html tags to valid xml tags and wrap the strings with a prefix
        // and suffix so that it forms a whole xml document before we attempt to
        // call the parser on them
        const wrappedSource = `${prefix}${this.convertUnclosedTags(source)}${suffix}`;
        const wrappedTarget = `${prefix}${this.convertUnclosedTags(target)}${suffix}`;

        // First, check the source string for problems. If there are any,
        // don't even bother checking the target string for problems because
        // we don't even know if they are valid problems. The translators may
        // just have echoed the problems already in the source. There will be
        // another rule that checks the well-formedness of the source string
        // for the engineers to fix. It is not the job of this rule to report
        // on the well-formedness of the source.
        try {
            srcObj = xml2js(wrappedSource, {
                trim: false
            });
        } catch (e) {
            // source is not well-formed, so don't even
            // attempt to parse the target! Just bail.
            return undefined;
        }

        try {
            // Second, tags that have no name are a special type of un-well-formedness
            // that we want to call out separately. If the target contains them, the
            // xml2js parser below will find it, but it will show as an unclosed tag error.
            // While that is true, it's a poor error message that doesn't help the
            // translators fix the real problem, which is the unnamed tag.
            if (unnamedTagRe.test(target)) {
                const highlight =
                    target.replace(/(<\/?>)/g, "<e0>$1</e0>");
                let opts = {
                    severity: "error",
                    rule: this,
                    description: `Empty XML elements <> and </> are not allowed in the target.`,
                    id: resource.getKey(),
                    highlight: `Target: ${highlight}`,
                    pathName: resource.getPath(),
                    source: resource.getSource(),
                    locale: resource.getTargetLocale()
                };
                problems.push(new Result(opts));
            }

            // Third, parse the target string for well-formedness. If it does not parse properly,
            // it throws the exception handled below
            tgtObj = xml2js(wrappedTarget, {
                trim: false
            });

            // And finally match the xml elements/tags from the source to the target
            problems = problems.concat(this.matchElements(srcObj, tgtObj, resource));
        } catch (e) {
            const lines = e.message.split(/\n/g);
            // find the column number in the 3rd line of the exception message and subtract off
            // the length of the prefix text we added in wrappedTarget
            const column = parseInt(lines[2].substring(8)) - prefix.length;
            // create the highlight, but make sure to escape any less than characters so that
            // it does not conflict with the highlight
            const highlight = column >= target.length ?
                target + '<e0/>' :
                target.substring(0, column) + '<e0>' + target[column] + '</e0>' + target.substring(column+1);
            let opts = {
                severity: "error",
                rule: this,
                description: `XML in translation is not well-formed. Error: ${lines[0]}`,
                id: resource.getKey(),
                highlight: `Target: ${highlight}`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        return problems.length < 2 ? problems[0] : problems;
    }
}

export default ResourceXML;
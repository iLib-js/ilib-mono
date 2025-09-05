/*
 * FileType.js - Represents a type of file in an ilib-lint project
 *
 * Copyright © 2023-2025 JEDLSoft
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

import log4js from "log4js";

import RuleSet from "./RuleSet.js";
import { Fixer, Parser, Rule, Serializer, Transformer } from "ilib-lint-common";
import Project from "./Project.js";

// type imports
/** @ignore @typedef {import("./RuleManager.js").RuleSetDefinition} RuleSetDefinition */

const logger = log4js.getLogger("ilib-lint.FileType");

/**
 * @class Represent a type of file in an ilib-lint project.
 *
 * Each file is classified into a particular file type. If
 * none of the file type definitions match, then the file will
 * be classified as being in the default "unknown" file type.
 * Files in the unknown file type are usually not processed.
 */
class FileType {
    /**
     * The lint project that this file is a part of.
     * @type {Project}
     * @readonly
     */
    project;

    /**
     * The name or glob spec for this file type
     * @type {String|undefined}
     * @readonly
     */
    name;

    /**
     * The list of locales to use with this file type
     * @type {Array.<String>|undefined}
     * @readonly
     */
    locales;

    /**
     * The intermediate representation type of this file type.
     * @type {String}
     * @readonly
     */
    type;

    /**
     * The array of classes of parsers to use with this file type.
     * @type {Array.<Parser>|undefined}
     * @readonly
     */
    parsers;

    /**
     * The array of instances of transformers to use with this file type.
     * @type {Array.<Transformer>|undefined}
     * @readonly
     */
    transformers;

    /**
     * The instance of the serializer to use with this file type.
     * @type {Serializer|undefined}
     * @readonly
     */
    serializer;

    /**
     * The array of rule sets to apply to files of this type.
     * @type {Array<String>|undefined}
     * @readonly
     */
    ruleset;

    /**
     * The path template for this file type.
     * @type {String|undefined}
     * @readonly
     */
    template;

    /**
     * Contructor a new instance of a file type.
     *
     * The array of parsers will be used to attempt to parse each
     * source file. If a parser throws an exception/error while parsing,
     * the linter will note that an error occurred and move on to
     * the next parser to see if that one will work. If ALL parsers
     * fail for a particular file, then this tool will print an
     * error message to the output about it.
     *
     * @param {Object} options the options governing the construction
     * of this file type as documented above
     * @param {String} options.name the name or glob spec for this file type
     * @param {Project} options.project the Project that this file type is a part of
     * @param {Array.<String>} [options.locales] list of locales to use with this file type
     * @param {String} [options.template] the path name template for this file type
     * which shows how to extract the locale from the path
     * name if the path includes it. Many file types
     * do not include the locale in the path, and in those cases,
     * the template can be left out. If a serializer is specified, then the template
     * is also used by the serializer to determine how to name the output files.
     * @param {Array.<String>} [options.parsers] an array of names of parsers to
     * apply to this file type. The first parser is the most important one, as its
     * type will be used to determine the type of intermediate representation, the
     * type of the rules, and the type of the transformers and serializer. If no
     * parsers are specified, then the parser manager will be asked to find all
     * parsers that can parse files of this type.
     * @param {Array.<String>|String|RuleSetDefinition} [options.ruleset] a list of rule set names
     * to use with this file type. Only rules in these rule sets that operate
     * on the same type of intermediate representation as the parsers will
     * be applied to the file.
     * @param {Array.<String>} [options.transformers] an array of transformer names
     * to apply to files of this type after the rules have been applied. Every transformer
     * must operate on the same type of intermediate representation as the parser.
     * @param {String} [options.serializer] the name of the serializer to use if
     * the file has been modified by a transformer or a fixer. The serializer must
     * operate on the same type of intermediate representation as the parser.
     * @constructor
     * @throws {Error} if a transformer or serializer is specified that does not
     * operate on the same type of intermediate representation as the parser, or
     * if a parser, transformer, or serializer cannot be found.
     */
    constructor(options) {
        if (!options || !options.name || !options.project) {
            throw "Missing required options to the FileType constructor";
        }

        /** @type {String|undefined} */
        let inferredType = undefined;

        this.name = options.name;
        this.project = options.project;
        this.locales = options.locales;
        this.template = options.template;

        const parserNames = options.parsers;
        if (parserNames) {
            const parserMgr = this.project.getParserManager();
            this.parsers = parserNames.map((parserName) => {
                const parser = parserMgr.getByName(parserName);
                if (!parser) {
                    throw `Could not find parser ${parserName} named in the configuration for filetype ${this.name}`;
                }
                if (!inferredType) {
                    inferredType = parserMgr.getType(parserName);
                }
                return parser;
            });
        }

        const unknownRuleset = options.ruleset;
        if (unknownRuleset) {
            if (Array.isArray(unknownRuleset)) {
                this.ruleset = unknownRuleset;
            } else if (typeof unknownRuleset === "string") {
                // single string -> convert to an array with a single element
                this.ruleset = [unknownRuleset];
            } else {
                // rule set definition instead of a ruleset name. Save a new
                // rule set definition in the rule manager and give it a
                // temp name so we can refer to it and make sure that this.ruleset
                // always points to an array of rule set names
                const ruleMgr = this.project.getRuleManager();
                const setName = `${this.name}-unnamed-ruleset`;
                ruleMgr.addRuleSetDefinition(setName, unknownRuleset);
                this.ruleset = [setName];
            }
        }

        const transformerNames = options.transformers;
        if (transformerNames) {
            const names = Array.isArray(transformerNames) ? transformerNames : [transformerNames];
            const transformerMgr = this.project.getTransformerManager();
            this.transformers = names.map((transformerName) => {
                const transformer = transformerMgr.get(transformerName);
                if (!transformer) {
                    throw `Could not find transformer ${transformerName} named in the configuration for filetype ${this.name}`;
                }
                const transformerType = transformer.getType();
                if (!inferredType) {
                    inferredType = transformerType;
                } else if (transformerType !== inferredType) {
                    throw new Error(
                        `The transformer ${transformerName} processes representations of type ${transformerType}, but the filetype ${this.name} handles representations of type ${inferredType}. The two types must match.`
                    );
                }
                return transformer;
            });
        }

        const serializerName = options.serializer;
        if (serializerName) {
            const serializerMgr = this.project.getSerializerManager();
            this.serializer = serializerMgr.get(serializerName);
            if (!this.serializer) {
                throw new Error(
                    `Could not find or instantiate serializer ${serializerName} named in the configuration for filetype ${this.name}`
                );
            }
            const serializerType = this.serializer.getType();
            if (!inferredType) {
                inferredType = serializerType;
            } else if (serializerType !== inferredType) {
                throw new Error(
                    `The serializer ${serializerName} processes representations of type ${serializerType}, but the filetype ${this.name} handles representations of type ${inferredType}. The two types must match.`
                );
            }
        }

        if (!inferredType) {
            inferredType = "string";
        }
        this.type = inferredType;
    }

    getName() {
        return this.name;
    }

    getProject() {
        return this.project;
    }

    getLocales() {
        return this.locales || this.project.getLocales();
    }

    getTemplate() {
        return this.template;
    }

    getType() {
        return this.type;
    }

    /**
     * Return an array of classes of parsers to use with this file type.
     * If the parsers are not named explicitly in the configuration,
     * this method will check with the parser manager to find all parsers
     * that can parse files with the given file name extension. If there
     * are none available, this method returned undefined;
     * @param {String} extension file name extension of the file being parsed
     * @returns {Parser[]} an array of parser classes to use with
     * files of this type.
     */
    getParsers(extension) {
        if (this.parsers) return this.parsers;
        const pm = this.project.getParserManager();
        return pm.get(extension);
    }

    /**
     * Return an array of names of rule sets.
     *
     * @returns {Array.<String>} a list of rule set names
     */
    getRuleSetNames() {
        return this.ruleset || [];
    }

    /**
     * Return a rule set that contains all the rules in all of the rule set
     * definitions.
     *
     * @returns {Array.<Rule>} a list of rule instances of all the rules in
     * all of the ruleset definitions
     */
    getRules() {
        if (this.rules) return this.rules;
        if (!this.ruleset || this.ruleset.length === 0) return [];

        const ruleMgr = this.project.getRuleManager();
        const set = new RuleSet();
        this.ruleset.forEach((ruleSetName) => {
            const definitions = ruleMgr.getRuleSetDefinition(ruleSetName);
            if (!definitions) {
                logger.error(`Could not find rule set ${ruleSetName}`);
                return;
            }
            for (let ruleName in definitions) {
                if (typeof definitions[ruleName] === "boolean") {
                    if (definitions[ruleName]) {
                        set.addRule(ruleMgr.get(ruleName));
                    } else {
                        // else explicitly turn the rule off
                        set.removeRule(ruleName);
                    }
                } else {
                    // only pass in the optional parameter if it is not boolean
                    set.addRule(ruleMgr.get(ruleName, definitions[ruleName]));
                }
            }
        });
        // the RuleSet takes care of making sure there are no dups, so now we
        // can just return the list of rule instances. Cache it for subsequent calls.
        this.rules = set.getRules();
        return this.rules;
    }

    /**
     * Return the list of transformers to use with this file type.
     *
     * @returns {Array.<Transformer>|undefined} an array of transformer instances to use
     * with this file type, or undefined if there are none.
     */
    getTransformers() {
        return this.transformers;
    }

    /**
     * Return an instance of the serializer class for this file type.
     *
     * @returns {Serializer|undefined} an instance of the serializer class for this
     * file type or undefined if there is no serializer for this file type.
     */
    getSerializer() {
        return this.serializer;
    }

    /**
     * Return an instance of the fixer class for this file type.
     *
     * @returns {Fixer|undefined} an instance of the fixer class for this
     * file type or undefined if there is no fixer for this file type.
     */
    getFixer() {
        return this.project.getFixerManager().get(this.type);
    }
}

export default FileType;

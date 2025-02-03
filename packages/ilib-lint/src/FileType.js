/*
 * FileType.js - Represents a type of file in an ilib-lint project
 *
 * Copyright © 2023-2024 JEDLSoft
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

import log4js from 'log4js';

import RuleSet from './RuleSet.js';

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
     * @param {String} [options.type] specifies the way that files of this file type
     * are parsed. This can be one of "resource", "source", "line", "string", or
     * "ast".
     * @param {String} [options.template] the path name template for this file type
     * which shows how to extract the locale from the path
     * name if the path includes it. Many file types
     * do not include the locale in the path, and in those cases,
     * the template can be left out.
     * @param {Array.<String>} [options.ruleset] a list of rule set names
     * to use with this file type
     * @param {Array.<String>} [options.parsers] an array of names of parsers to
     * apply to this file type
     * @param {Array.<String>} [options.transformers] an array of transformer names
     * to apply to files of this type after the rules have been applied
     * @param {String|Object} [options.serializer] a serializer to use if the file has been
     * modified by a transformer or a fixer
     * @constructor
     */
    constructor(options) {
        if (!options || !options.name || !options.project) {
            throw "Missing required options to the FileType constructor";
        }
        ["name", "project", "locales", "ruleset", "template", "type", "parsers", "transformers", "serializer"].forEach(prop => {
            if (typeof(options[prop]) !== 'undefined') {
                this[prop] = options[prop];
            }
        });

        this.type = this.type || "string";

        if (this.ruleset) {
            if (typeof(this.ruleset) === 'string') {
                // single string -> convert to an array with a single element
                this.ruleset = [ this.ruleset ];
            } else if (!Array.isArray(this.ruleset)) {
                // rule set definition instead of a ruleset name. Save a new
                // rule set definition in the rule manager and give it a
                // temp name so we can refer to it and make sure that this.ruleset
                // always points to an array of rule set names
                const ruleMgr = this.project.getRuleManager();
                const setName = `${this.name}-unnamed-ruleset`;
                ruleMgr.addRuleSetDefinition(setName, this.ruleset);
                this.ruleset = [ setName ];
            }
        }

        if (this.parsers) {
            const parserMgr = this.project.getParserManager();
            this.parserClasses = this.parsers.map(parserName => {
                const parser = parserMgr.getByName(parserName);
                if (!parser) {
                    throw `Could not find parser ${parserName} named in the configuration for filetype ${this.name}`;
                }
                return parser;
            });
        }

        /*
        if (this.transformers) {
            const transformerMgr = this.project.getTransformerManager();
            this.transformerClasses = this.transformers.map(transformerName => {
                const transformer = transformerMgr.getByName(transformerName);
                if (!transformer) {
                    throw `Could not find transformer ${transformerName} named in the configuration for filetype ${this.name}`;
                }
                return transformer;
            });
        }
        */

        if (this.serializer) {
            // if it is a string, then that string is the name of the serializer. If it is an object,
            // then it the name and the settings to pass to the the serializer constructor.
            const name = typeof(this.serializer) === 'string' ? this.serializer : this.serializer.name;
            const serializerMgr = this.project.getSerializerManager();
            this.serializerInst = serializerMgr.get(name, this.serializer);
            if (!this.serializerInst) {
                throw `Could not find serializer ${this.serializer} named in the configuration for filetype ${this.name}`;
            }
        }
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
     * @returns {Array.<Class>} an array of parser classes to use with
     * files of this type.
     */
    getParserClasses(extension) {
        if (this.parserClasses) return this.parserClasses;
        const pm = this.project.getParserManager();
        return pm.get(extension);
    }

    /**
     * Return an array of names of rule sets.
     *
     * @returns {Array.<String>} a list of rule set names
     */
    getRuleSetNames() {
        return this.ruleset;
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
        this.ruleset.forEach(ruleSetName => {
            const definitions = ruleMgr.getRuleSetDefinition(ruleSetName);
            if (!definitions) {
                logger.error(`Could not find rule set ${ruleSetName}`);
                return;
            }
            for (let ruleName in definitions) {
                if (typeof(definitions[ruleName]) === 'boolean') {
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
     * Return an instance of the serializer class for this file type.
     *
     * @returns {Serializer|undefined} an instance of the serializer class for this
     * file type or undefined if there is no serializer for this file type.
     */
    getSerializer() {
        return this.serializerInst;
    }
}

export default FileType;

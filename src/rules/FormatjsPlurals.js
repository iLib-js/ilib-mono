/*
 * FormatjsPlurals.js - rule to check formatjs style plurals in the source string
 *
 * Copyright © 2023 JEDLSoft
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

import { IntlMessageFormat } from 'intl-messageformat';
import Locale from 'ilib-locale';
import { Rule, Result } from 'i18nlint-common';
import { findNodeAt } from 'acorn-walk';
import { default as jp } from 'jsonpath';

// all the plural categories from CLDR
const allCategories = ["zero", "one", "two", "few", "many", "other"];

// Map the language to the set of plural categories that the language
// uses. If the language is not listed below, it uses the default
// list of plurals: "one" and "other"
const categoriesForLang = {
    "ja": [ "other" ],
    "zh": [ "other" ],
    "ko": [ "other" ],
    "th": [ "other" ],
    "lv": [ "zero", "one", "other" ],
    "ga": [ "one", "two", "other" ],
    "ro": [ "one", "few", "other" ],
    "lt": [ "one", "few", "other" ],
    "ru": [ "one", "few", "other" ],
    "uk": [ "one", "few", "other" ],
    "be": [ "one", "few", "other" ],
    "sr": [ "one", "few", "other" ],
    "hr": [ "one", "few", "other" ],
    "cs": [ "one", "few", "other" ],
    "sk": [ "one", "few", "other" ],
    "pl": [ "one", "few", "other" ],
    "sl": [ "one", "two", "few", "other" ],
    "ar": [ "zero", "one", "two", "few", "many", "other" ]
}

/**
 * @class Represent an ilib-lint rule.
 */
class FormatjsPlurals extends Rule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "source-formatjs-plurals";
        this.description = "Ensure that plurals in formatjs style have the correct syntax";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/ilib-js/ilib-lint-react/blob/main/docs/source-formatjs-plurals.md";
    }

    getRuleType() {
        return "ast-jstree";
    }

    /**
     * @private
     */
    checkPluralCategories(ast, neededCategories, message, pathName) {
        let value = [];
        for (let i = 0; i < ast.length; i++) {
            const opts = ast[i].options;
            if (opts) {
                // check if any of the needed categories are missing
                const missing = neededCategories.filter(category => {
                    return typeof(opts[category]) === 'undefined';
                });
                if (missing && missing.length) {
                    let opts = {
                        severity: "error",
                        rule: this,
                        description: `Missing these plural categories in string: ${missing.join(", ")}. Expecting these: ${neededCategories.join(", ")}`,
                        id: message.id,
                        highlight: `<e0>${stringToCheck}</e0>`,
                        pathName
                    };
                    value.push(new Result(opts));
                }
                for (let category in opts) {
                    if (opts[category] && Array.isArray(opts[category].value)) {
                        value = value.concat(this.checkPluralCategories(opts[category].value, neededCategories, message, pathName));
                    }
                }
            }
        }
        return value;
    }

    checkString(message, file, locale) {
        const sLoc = new Locale(locale);
        let results;
        let problems = [];
        try {
            const imf = new IntlMessageFormat(message.defaultMessage, locale);
            let categories = categoriesForLang[sLoc.getLanguage()] || [ "one", "other" ];
            // look in the abstract syntax tree for the categories that were parsed out and make
            // sure the required ones are there
            const ast = imf.getAst();
            problems = problems.concat(this.checkPluralCategories(ast, categories, message, file));
        } catch (e) {
            let value = {
                pathName: file,
                severity: "error",
                rule: this,
                description: `Incorrect plural or select syntax in string: ${e}`,
                id: message.id,
                highlight: `${message.defaultMessage.substring(0, e.location.end.offset)}<e0>${message.defaultMessage.substring(e.location.end.offset)}</e0>`,
                pathName: file
            };
            if (message.location) {
                value.lineNumber = message.location.start.line;
            }
            problems.push(new Result(value));
        }
        return problems;
    }

    /**
     * @override
     */
    match(options) {
        const { ir, file } = options;
        const sourceLocale = this.sourceLocale;
        let problems = [];

        // don't parse representations we don't know about
        if ( ir.getType() !== "ast-jstree") return;

        // use jsonpath to parse the abstract syntax tree
        const messageNodes = jp.query(ir.getRepresentation(), '$..[?(@.type=="CallExpression" && @.callee.name == "defineMessages")].arguments[0].properties[*].value.properties');

        if (messageNodes) {
            //console.log(`Found the node ${JSON.stringify(messageNodes, undefined, 2)}`);
            const results = messageNodes.map(node => {
                const propNames = jp.query(node, '$[*].key.name');
                const propValues = jp.query(node, '$[*].value.value');
                const locations = jp.query(node, '$[*].value.loc');
                //console.log(`propName is ${JSON.stringify(propNames, undefined, 2)}`);
                //console.log(`propValues is ${JSON.stringify(propValues, undefined, 2)}`);
                let message = {};
                for (let i = 0; i < propNames.length; i++) {
                    message[propNames[i]] = propValues[i];
                    message.location = locations[i];
                }
                //console.log(`message is ${JSON.stringify(message, undefined, 2)}`);
                return this.checkString(message, file, sourceLocale);
            }).flat();
            return (results.length < 2) ? results[0] : results;
        } else {
            console.log("Did not find the defineMessages node");
        }
    }

    // no match
    return;
}

export default FormatjsPlurals;
/*
 * ResourceDNTTerms.js - rule to ensure that Do Not Translate terms have not been translated
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

import { Result } from "ilib-lint-common";
import fs from "node:fs";
import path from "node:path";

import ResourceRule from './ResourceRule.js';

/** Rule to ensure that Do Not Translate terms have not been translated;
 * i.e., if a DNT term appears in source, it has to appear in target as well */
class ResourceDNTTerms extends ResourceRule {
    /** @readonly */ name = "resource-dnt-terms";
    /** @readonly */ description = "Ensure that Do Not Translate terms have not been translated.";
    /** @readonly */ link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-dnt-terms.md";

    /**
     * @protected
     * @readonly
     * @type {string[]}
     */
    _dntTerms = [];

    /**
     * @typedef ExplicitTerms
     * @type {object}
     * @property {string[]} terms Explicit list of DNT terms to check
     */

    /**
     * @typedef FileTerms
     * @type {object}
     * @property {string} termsFilePath Path to DNT terms file (either absolute or relative to current working directory)
     * @property {("json"|"txt")} [termsFileType] Determines how DNT file should be parsed - either as JSON or as TXT with one term per line
     */

    constructor(/** @type {ExplicitTerms | FileTerms | {}} */ params) {
        super(params);
        let /** @type {string[]} */ terms = [];

        if ("terms" in params) {
            // explicit terms from config
            terms = params.terms;
            // ensure valid type
            if (!Array.isArray(terms) || !terms.every((term) => "string" === typeof term)) {
                throw new Error(`DNT terms provided in an unexpected format; expected string[]`);
            }
        } else if ("termsFilePath" in params) {
            // if the terms are not provided explicitly, parse them from a file
            let termsFileType = params.termsFileType ?? path.extname(params.termsFilePath).slice(1).toLowerCase();
            switch (termsFileType) {
                case "json":
                    terms = ResourceDNTTerms.parseTermsFromJsonFile(params.termsFilePath);
                    break;
                case "txt":
                    terms = ResourceDNTTerms.parseTermsFromTxtFile(params.termsFilePath);
                    break;
                default:
                    throw new Error(`"${termsFileType}" is not a valid DNT terms file type`);
            }
        } else {
            // no terms provided
            terms = [];
        }

        this._dntTerms = [...new Set(terms.filter((t) => t.length > 0))];
    }

    /**
     * Check that if a given resource has a DNT term in the source, then
     * it also exists in the target
     * @override
     * @param {string} source the source string
     * @param {string} target the target string
     * @param {import("ilib-tools-common").Resource} resource the resource being checked 
     * @param {string} file the file where the resource came from
     * @returns {Array.<Result>|undefined} the results
     */
    matchString({ source, target, resource, file }) {
        const resultProps = {
            id: resource.getKey(),
            rule: this,
            pathName: file,
            locale: resource.getTargetLocale(),
            severity: "error",
            description: "A DNT term is missing in target string.",
        };

        const results = [];

        for (const term of this._dntTerms) {
            if (source && source.includes(term) && target && !target.includes(term)) {
                results.push(new Result({
                    source,
                    highlight: `Missing term: <e0>${term}</e0>`,
                    ...resultProps
                }));
            }
        }

        return results.filter(element => element);
    }

    /** Parse DNT terms from a JSON `string[]` file
     * @param path Path to a DNT dictionary stored as JSON `string[]` file
     */
    static parseTermsFromJsonFile(/** @type {string} */ path) {
        const text = fs.readFileSync(path, "utf8");
        let content = undefined;
        try {
            content = JSON.parse(text);
        } catch {
            throw new Error(`Failed to parse DNT terms file as JSON`);
        }
        if (!Array.isArray(content) || !content.every((term) => "string" === typeof term)) {
            throw new Error(`DNT terms JSON file has unexpected content; expected string[]`);
        }
        return /** @type {string[]} */ (content);
    }

    /** Parse DNT terms from a text file by treating each line in file as a separate term
     *
     * While parsing, it excludes empty lines and trims leading/trailing whitespace on each line
     */
    static parseTermsFromTxtFile(/** @type {string} */ path) {
        const text = fs.readFileSync(path, "utf8");
        return text
            .split(/[\r\n]+/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }
}

export default ResourceDNTTerms;

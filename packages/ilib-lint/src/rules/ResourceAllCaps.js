/*
 * ResourceAllCaps.js - rule for checking that ALL CAPS source strings have ALL CAPS targets
 *
 * Copyright © 2025 JEDLSoft
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
import ResourceRule from './ResourceRule.js';
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

import {Result} from 'ilib-lint-common';
import Locale from 'ilib-locale';
import {isAlpha, isUpper} from 'ilib-ctype';
import CaseMapper from 'ilib-casemapper';
import { scriptInfoFactory } from 'ilib-scriptinfo';
import LocaleMatcher from 'ilib-localematcher';

// type imports
/** @ignore @typedef {import('ilib-tools-common').Resource} Resource */
/** @ignore @typedef {import('../plugins/resource/ResourceFix.js').default} ResourceFix */

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting ALL CAPS strings.
 * @class
 */
class ResourceAllCaps extends ResourceRule {
    /**
     * Create a ResourceAllCaps rule instance.
     * @param {object} options
     * @param {string[]} [options.exceptions] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-all-caps";
        this.description = "Ensure that when source strings are in ALL CAPS, then the targets are also in ALL CAPS";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-all-caps.md";
        this.exceptions = Array.isArray(options?.exceptions) ? options.exceptions : [];
    }

    /**
     * Check if a source string is in ALL CAPS and if the target string matches the casing style.
     * @override
     * @param {{source: (String|undefined), target: (String|undefined), file: String, resource: Resource}} params
     * @returns {Result|undefined} A Result with severity 'error' if the source string is in ALL CAPS and target string is not in ALL CAPS, otherwise undefined.
     */
    // @ts-ignore - index and category are documented in JSDoc but not in TypeScript definitions
    matchString({source, target, file, resource, index, category}) {
        if (!source || !target) {
            return;
        }

        const isException = this.exceptions.includes(source);
        if (isException) {
            return;
        }

        const isAllCaps = ResourceAllCaps.isAllCaps(source);
        if (!isAllCaps) {
            return;
        }

        // Check if the target locale supports capital letters
        if (!ResourceAllCaps.hasCapitalLetters(resource.targetLocale || 'en-US')) {
            return;
        }

        // Check if target matches the ALL CAPS style
        if (ResourceAllCaps.isAllCaps(target)) {
            return;
        }

        const result = new Result({
            severity: "error",
            id: resource.getKey(),
            source,
            description: "The source string is in ALL CAPS, but the target string is not.",
            rule: this,
            locale: resource.targetLocale,
            pathName: file,
            fix: this.createFix(resource, target, file, index, category),
            highlight: `<e0>${target}</e0>`
        });
        return result;
    }

    /**
     * Get the fix for this rule - converts target to ALL CAPS while preserving the translation
     * @param {Resource} resource the resource to fix
     * @param {string} target the current target string
     * @param {string} file the file path
     * @param {number} [index] the index for array resources
     * @param {string} [category] the category for plural resources
     * @returns {ResourceFix} the fix for this rule
     */
    createFix(resource, target, file, index, category) {
        const locale = resource.targetLocale || 'en-US';
        const casemapper = new CaseMapper({
            locale,
            direction: "toupper"
        });
        const upperCaseTarget = casemapper.map(target) || target;

        const command = ResourceFixer.createStringCommand(0, target.length, upperCaseTarget);
        return ResourceFixer.createFix({
            resource,
            target: true,
            category,
            index,
            commands: [command]
        });
    }

    /**
     * Checks if a given string is in ALL CAPS style, i.e. at least 2 letter characters exist and all of them are uppercase.
     * 
     * @public
     * @param {string} string A non-empty string to check.
     * @returns {boolean} Returns true for a string that is in ALL CAPS (all letter characters are uppercase and at least 2 letter characters exist).
     * Otherwise, returns false.
     */
    static isAllCaps(string) {
        if (!string || typeof string !== 'string') {
            return false;
        }

        const trimmed = string.trim();
        if (trimmed.length < 2) {
            return false;
        }

        let letterCount = 0;
        let allLettersUpper = true;

        for (let i = 0; i < trimmed.length; i++) {
            const char = trimmed[i];
            if (isAlpha(char)) {
                letterCount++;
                if (!isUpper(char)) {
                    allLettersUpper = false;
                    break;
                }
            }
        }

        return letterCount >= 2 && allLettersUpper;
    }

    /**
     * A language by itself cannot have capitalization; Instead, it's a property of a script.
     * Therefore, if no script is explicitly specified in the locale, use LocaleMatcher to guess the likely full
     * locale, which includes the script tag. Then check if the script supports capital letters.
     * This is a guess of course because you cannot know for sure exactly what full locale
     * corresponds to the source locale.
     * @public
     * @param {string} locale The locale to check for capital letter support.
     * @returns {boolean} Returns true if the locale's script supports capital letters, false otherwise.
     */
    static hasCapitalLetters(locale) {
        if (!locale) {
            return true; // Default to true for unknown locales
        }

        try {
            const localeObj = new Locale(locale);
            let script = localeObj.getScript();

            // If no script is specified, use LocaleMatcher to get the likely locale
            if (!script) {
                const localeMatcher = new LocaleMatcher({ locale: locale });
                const likelyLocale = localeMatcher.getLikelyLocale();
                if (likelyLocale) {
                    const likelyLocaleObj = new Locale(likelyLocale);
                    script = likelyLocaleObj.getScript();
                }
            }

            if (script) {
                const scriptInfo = scriptInfoFactory(script);
                return scriptInfo?.getCasing() ?? true;
            }

            return true; // Default to true for unknown scripts
        } catch (error) {
            // If there's any error parsing the locale or script, default to true
            return true;
        }
    }
}

export default ResourceAllCaps; 
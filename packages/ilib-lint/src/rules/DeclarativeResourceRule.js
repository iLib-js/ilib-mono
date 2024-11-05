/*
 * DeclarativeResourceRule.js - subclass of ResourceRule that can iterate over
 * an arrays of regular expressions to apply to a resource
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

import Locale from 'ilib-locale';

import ResourceRule from './ResourceRule.js';

// figure out which regex flags are supported on this version of node
let regexFlags = "g";

try {
    new RegExp(".", "u");
    regexFlags += "u";
} catch (e) {}

try {
    new RegExp(".", "d");
    regexFlags += "d";
} catch (e) {}

/**
 * @private
 */
function getLangSpec(spec) {
    const locale = new Locale(spec);
    return locale.getLangSpec();
}

class DeclarativeResourceRule extends ResourceRule {
    /**
     * Construct a new regular expression-based declarative resource rule.
     *
     * @param {Object} options options as documented above
     * @param {String} options.name the unique name of this rule
     * @param {String} options.description a one-line description of what
     *   this rule checks for. Example: "Check that URLs in the source also
     *   appear in the target"
     * @param {String} options.note a one-line note that will be printed on
     *   screen when the check fails. Example: "The URL {matchString} did
     *   not appear in the target." (Currently, matchString is the only
     *   replacement param that is supported.)
     * @param {String} options.regexps an array of strings that encode
     *   regular expressions to look for. Only one of these regexps needs to
     *   match in order to trigger a result from this rule. The first one that
     *   matches will be taken, so the order of regular expressions is
     *   important. In general, you should order your regular expressions from
     *   most specific to least specific.
     * @param {String} [options.sourceLocale] the source locale of this rule
     * @param {String} [options.link] the URL to a web page that explains this
     *   rule in more detail
     * @param {{"error"|"warning"|"suggestion"}} [options.severity] the severity
     *   of the Result if this rule matches
     * @param {Array.<String>} [options.locales] the target locales to which this
     *   rule applies. If specified, this rule will skip resources that have a
     *   target locale that does not match either the language or the language-script
     *   part of each of the locales. If not specified, the rule applies to all
     *   target locales.
     * @param {Array.<String>} [options.skipLocales] the target locales to which this
     *   rule does not apply. If specified, this rule will skip resources that have a
     *   target locale that matches either the language or the language-script
     *   part of any of the given locales. If not specified, the rule applies to all
     *   target locales. If both locales and skipLocales are specified, only the
     *   locales will used.
     * @param {Boolean} [options.useStripped] if true, the string will stripped of all
     *   plurals before attempting a match. If false, the original source string with
     *   possible plurals in it will be used for the match. Default is "true".
     * @constructor
     */
    constructor(options) {
        super(options);

        if (!options || !options.name || !options.description || !options.note || !options.regexps) {
            throw "Missing required options for the DeclarativeResourceRule constructor";
        }

        ["name", "description", "note", "sourceLocale", "link", "severity", "useStripped"].forEach(prop => {
            this[prop] = options[prop];
        });
        this.sourceLocale = this.sourceLocale || "en-US";
        this.severity = this.severity || "error";
        this.useStripped = typeof(this.useStripped) !== "boolean" ? true : this.useStripped;

        // this may throw if you got to the regexp syntax wrong:
        this.re = options.regexps.map(regexp => new RegExp(regexp, regexFlags));
        if (options.locales) {
            if (typeof(options.locales) === "string") {
                this.locales = new Set([ getLangSpec(options.locales) ]);
            } else if (Array.isArray(options.locales)) {
                this.locales = new Set(options.locales.map(spec => getLangSpec(spec)));
            }
        } else if (options.skipLocales) {
            if (typeof(options.skipLocales) === "string") {
                this.skipLocales = new Set([ getLangSpec(options.skipLocales) ]);
            } else if (Array.isArray(options.skipLocales)) {
                this.skipLocales = new Set(options.skipLocales.map(spec => getLangSpec(spec)));
            }
        }
    }

    /**
     * Check a specific source/target pair for a match with the given regular expression.
     *
     * @abstract
     * @param {Object} params a parameters object
     * @param {RegExp} params.re the regular expression to match
     * @param {String|undefined} params.source the source string to match against
     * @param {String|undefined} params.target the target string to match against
     * @param {String} params.file path to the file where this resource was found
     * @param {Resource} params.resource the resource where this pair of strings is from
     * @returns {Result|Array.<Result>|undefined} the Result objects detailing
     * any matches to the regular expression
     */
    checkString(params) {}

    /**
     * @override
     */
    matchString({source, target, file, resource}) {
        if (this.locales || this.skipLocales) {
            const locale = new Locale(resource.getTargetLocale()).getLangSpec();
            if ((this.locales && !this.locales.has(locale)) || (this.skipLocales && this.skipLocales.has(locale))) {
                // the target locale of this resource is not in
                // the set of languages that this rule applies to,
                // so just skip it
                return;
            }
        }
        let results = [];
        // only need 1 regexp to match in order to trigger this rule
        for (const re of this.re) {
            results = results.concat(this.checkString({re, source, target, file, resource}) ?? []);
            if (results.length > 0) break;
        }
        results = results.filter(result => result);
        return results && results.length ? results : undefined;
    }
}

export default DeclarativeResourceRule;
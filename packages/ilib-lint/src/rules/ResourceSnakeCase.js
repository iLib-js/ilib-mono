import ResourceRule from './ResourceRule.js';
import {Result} from 'ilib-lint-common';

/** @ignore @typedef {import('ilib-tools-common').Resource} Resource */

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting snake cased strings.
 * @class
 * @augments ResourceRule
 */
class ResourceSnakeCase extends ResourceRule {
    /**
     * Create a ResourceSnakeCase rule instance.
     * @param {object} options
     * @param {object} [options.param]
     * @param {string[]} [options.param.except] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-snake-case";
        this.description = "Ensure that when source strings contain only snake case and no whitespace, then the targets are the same";
        this.link = "https://gihub.com/ilib-js/ilib-lint/blob/main/docs/resource-snake-case.md",
        this.regexps = [
            "^\\s*[a-zA-Z0-9]*(_[a-zA-Z0-9]+)+\\s*$",
            "^\\s*[a-zA-Z0-9]+(_[a-zA-Z0-9]+)*_\\s*$"
        ]
        this.exceptions = Array.isArray(options?.param?.except) ? options.param.except : [];
    }

    /**
     * Check if a source string is in snake case and if the target string is the same as the source.
     * @public
     * @override ResourceRule.matchString
     * @param {{source: (String|undefined), target: (String|undefined), file: String, resource: Resource}} params
     * @returns {Result|undefined} A Result with severity 'error' if the source string is in snake case and target string is not the same as the source string, otherwise undefined.
     */
    matchString({source, target, file, resource}) {
        if (!source || !target) {
            return;
        }

        const isException = this.exceptions.includes(source);
        if (isException) {
            return;
        }

        const isSnakeCase = this.isSnakeCase(source);
        if (!isSnakeCase) {
            return;
        }

        if (source !== target) {
            return new Result({
                severity: "error",
                id: resource.getKey(),
                source,
                description: "Do not translate the source string if it consists solely of snake cased strings and/or digits. Please update the target string so it matches the source string.",
                rule: this,
                locale: resource.sourceLocale,
                pathName: file,
                highlight: `<e0>${target}</e0>`
            })
        }
    }

    /**
     * @public
     * @param {string} string A non-empty string to check.
     * @returns {boolean} Returns true for a string that is in snake case (matches one of the regular expressions declared in the constructor).
     * Otherwise, returns false.
     */
    isSnakeCase(string) {
        const trimmed = string.trim();
        for (const regexp of this.regexps) {
            const match = RegExp(regexp).test(trimmed);

            if (match) {
                return true;
            }
        }
        return false;
    }
}

export default ResourceSnakeCase;

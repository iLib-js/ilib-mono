import ResourceRule from './ResourceRule.js';
import {Result} from 'ilib-lint-common';

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting camel cased strings.
 * @class
 * @augments ResourceRule
 */
class ResourceCamelCase extends ResourceRule {
    /**
     * Create a ResourceCamelCase rule instance.
     * @param {object} options
     * @param {Configuration} [options.param]
     * @param {string[]} [options.param.except] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-camel-case";
        this.description = "Ensure that when source strings contain only camel case and no whitespace, then the targets are the same";
        this.link = "https://gihub.com/ilib-js/ilib-lint/blob/main/docs/resource-camel-case.md";
        this.regexps = [
            "^\\s*[a-z\\d]+([A-Z][a-z\\d]+)+\\s*$",
            "^\\s*[A-Z][a-z\\d]+([A-Z][a-z\\d]+)+\\s*$",
        ];
        this.exceptions = options?.param?.except ?? [];
    }

    /**
     * Check if a source string is in camel case and if the target string is the same as the source.
     * @public
     * @override ResourceRule.matchString
     * @param {{source: (String|undefined), target: (String|undefined), file: String, resource: Resource}}
     * @returns {Result|undefined} A Result with severity 'error' if the source string is in camel case and target string is not the same as the source string, otherwise undefined.
     */
    matchString({source, target, file, resource}) {
        if (!source || !target) {
            return;
        }

        const isException = this.exceptions.includes(source);
        if (isException) {
            return;
        }

        const isCamelCase = this.isCamelCase(source);
        if (!isCamelCase) {
            return;
        }

        if (source !== target) {
            return new Result({
                severity: "error",
                id: resource.getKey(),
                source,
                description: "Do not translate the source string if it consists solely of camel cased strings and/or digits. Please update the target string so it matches the source string.",
                rule: this,
                locale: resource.sourceLocale,
                pathName: file
            })
        }
    }

    /**
     * @public
     * @param {string} string A non-empty string to check.
     * @returns {boolean} Returns true for a string that is in camel case (matches one of the regular expressions declared in the constructor).
     * Otherwise, returns false.
     */
    isCamelCase(string) {
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

export default ResourceCamelCase;

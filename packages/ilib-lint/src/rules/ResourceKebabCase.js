import ResourceRule from './ResourceRule.js';
import {Result} from 'ilib-lint-common';
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

/** @ignore @typedef {import('ilib-tools-common').Resource} Resource */

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting kebab cased strings.
 * @class
 */
class ResourceKebabCase extends ResourceRule {
    /**
     * Create a ResourceKebabCase rule instance.
     * @param {object} options
     * @param {object} [options.param]
     * @param {string[]} [options.param.except] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-kebab-case";
        this.description = "Ensure that when source strings contain only kebab case and no whitespace, then the targets are the same";
        this.link = "https://gihub.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-kebab-case.md";
        this.regexps = [
            "^\\s*[a-zA-Z0-9]*(-[a-zA-Z0-9]+)+\\s*$",
            "^\\s*[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*-\\s*$"
        ];
        this.exceptions = Array.isArray(options?.param?.except) ? options.param.except : [];
    }

    /**
     * Check if a source string is in kebab case and if the target string is the same as the source.
     * @override
     */
    matchString({source, target, file, resource, index, category}) {
        if (!source || !target) {
            return;
        }

        const isException = this.exceptions.includes(source);
        if (isException) {
            return;
        }

        const isKebabCase = this.isKebabCase(source);
        if (!isKebabCase) {
            return;
        }

        if (source !== target) {
            const result = new Result({
                severity: "error",
                id: resource.getKey(),
                source,
                description: "Do not translate the source string if it consists solely of kebab cased strings and/or digits. Please update the target string so it matches the source string.",
                rule: this,
                locale: resource.sourceLocale,
                pathName: file,
                highlight: `<e0>${target}</e0>`
            });
            result.fix = this.getFix(resource, source, index, category);
            return result;
        }
    }

    /**
     * Get the fix for this rule
     * @param {Resource} resource the resource to fix
     * @param {string} source the source string that should be used in the target
     * @returns {import('../plugins/resource/ResourceFix.js').default} the fix for this rule
     */
    getFix(resource, source, index, category) {
        const command = ResourceFixer.createStringCommand(0, resource.getTarget().length, source);
        return ResourceFixer.createFix({
            resource,
            target: true,
            commands: [command],
            category,
            index
        });
    }

    /**
     * @public
     * @param {string} string A non-empty string to check.
     * @returns {boolean} Returns true for a string that is in kebab case (matches one of the regular expressions declared in the constructor).
     * Otherwise, returns false.
     */
    isKebabCase(string) {
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

export default ResourceKebabCase;
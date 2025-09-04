import ResourceRule from './ResourceRule.js';
import {Result} from 'ilib-lint-common';
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

// type imports
/** @ignore @typedef {import('ilib-tools-common').Resource} Resource */
/** @ignore @typedef {import('../plugins/resource/ResourceFix.js').default} ResourceFix */

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting kebab cased strings.
 * @class
 */
class ResourceKebabCase extends ResourceRule {
    /**
     * Create a ResourceKebabCase rule instance.
     * @param {object} options
     * @param {string[]} [options.except] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-kebab-case";
        this.description = "Ensure that when source strings contain only kebab case and no whitespace, then the targets are the same";
        this.link = "https://gihub.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-kebab-case.md";

        this.exceptions = Array.isArray(options?.except) ? options.except : [];
    }

    /**
     * Check if a source string is in kebab case and if the target string is the same as the source.
     * @override
     * @param {Object} params
     * @param {string} params.source the source string to match against
     * @param {string} params.target the target string to match against
     * @param {string} params.file the file path where the resources came from
     * @param {Resource} params.resource the resource that contains the source and/or target string
     * @param {number} [params.index] if the resource being tested is an array resource, this represents the index of this string in the array
     * @param {string} [params.category] if the resource being tested is a plural resource, this represents the plural category of this string
     * @returns {Result|undefined} A Result with severity 'error' if the source string is in kebab case and target string is not the same as the source string, otherwise undefined.
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
                locale: resource.getTargetLocale(),
                pathName: file,
                highlight: `<e0>${target}</e0>`,
                lineNumber: resource.getLocation()?.line
            });
            result.fix = this.getFix(resource, source, index, category);
            return result;
        }
    }

    /**
     * Get the fix for this rule
     * @param {Resource} resource the resource to fix
     * @param {string} source the source string that should be used in the target
     * @param {number} [index] if the resource being tested is an array resource, this represents the index of this string in the array
     * @param {string} [category] if the resource being tested is a plural resource, this represents the plural category of this string
     * @returns {ResourceFix} the fix for this rule
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
     * @returns {boolean} Returns true for a string that is in kebab case with at least 2 dashes.
     * Otherwise, returns false.
     */
    isKebabCase(string) {
        const trimmed = string.trim();

        // Count the number of dashes in the string
        const dashCount = (trimmed.match(/-/g) || []).length;

        // Require at least 2 dashes to be considered kebab case
        if (dashCount < 2) {
            return false;
        }

        // Basic pattern check: only letters, numbers, and hyphens allowed
        // and no consecutive hyphens
        if (!/^[a-zA-Z0-9\-]+$/.test(trimmed) || /--/.test(trimmed)) {
            return false;
        }

        return true;
    }
}

export default ResourceKebabCase;
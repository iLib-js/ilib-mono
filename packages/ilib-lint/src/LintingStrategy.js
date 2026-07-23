/*
 * LintingStrategy.js
 *
 * Copyright © 2025 Box, Inc.
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
import { Fix, Fixer, IntermediateRepresentation, Result, Rule } from "ilib-lint-common";

import FileType from "./FileType.js";
import FixerManager from "./FixerManager.js";

const logger = log4js.getLogger("ilib-lint.LintingStrategy");

const DEFAULT_MAX_AUTOFIX_ITERATIONS = 10;

/**
 * Encapsulates the logic for linting an {@link IntermediateRepresentation}.
 */
class LintingStrategy {
    /**
     * The type of IR to lint
     * @type {string}
     * @readonly
     */
    type;

    /**
     * The rules to apply during linting
     * @type {readonly Rule[]}
     * @readonly
     */
    rules;

    /**
     * Maximum number of iterations to apply autofixing to a single IR
     * @type {number}
     * @readonly
     */
    maxAutofixIterations;

    /**
     * The fixer to use for applying fixes
     * @type {Fixer|undefined}
     * @readonly
     */
    fixer;

    /**
     * @param {Object} params
     * @param {string} params.type the type of IR to lint
     * @param {Rule[]} params.rules the rules to apply during linting
     * @param {Fixer} [params.fixer] the fixer to use for applying fixes
     * @param {number} [params.maxAutofixIterations] maximum number of iterations to apply autofixing to a single IR
     */
    constructor({ type, rules, fixer, maxAutofixIterations }) {
        this.type = type;
        if (rules.some((rule) => rule.getRuleType() !== type)) {
            throw new Error(`Rules don't match provided type [${type}]`);
        }
        this.rules = rules;
        if (fixer && fixer.type !== type) {
            throw new Error(`Fixer doesn't match provided type [${type}]`);
        }
        this.fixer = fixer;
        this.maxAutofixIterations = Math.max(1, maxAutofixIterations ?? DEFAULT_MAX_AUTOFIX_ITERATIONS);
    }

    /**
     * Lint an IR using the instance rules and fixer.
     *
     * This method will apply the instance {@link Rule}s to the IR.
     * If the Rules produce fixes, the instance {@link Fixer} will be used to apply them.
     * When autofixing occurs, the method will re-apply the Rules -
     * this process will repeat until no more autofixes are applied
     * or the maximum number of iterations is reached.
     * {@link Result}s will be accumulated throughout the iterations.
     *
     * @param {Object} params
     * @param {IntermediateRepresentation} params.ir the IR to lint
     * @param {string} params.filePath the path to the file from which the IR was parsed
     * @param {string} [params.locale] the locale of the file from which the IR was parsed
     * @returns {Result[]} accumulated Results of the linting process
     */
    apply({ ir, filePath, locale }) {
        if (ir.getType() !== this.type) {
            throw new Error(`IR type [${ir.getType()}] doesn't match expected type [${this.type}]`);
        }

        const accumulatedResults = [];

        let autofixIteration = 0;
        while (autofixIteration < this.maxAutofixIterations) {
            // apply Rules
            logger.trace(`Linting iteration ${autofixIteration}`);
            const results = this.rules
                .flatMap((rule) => {
                    logger.trace(`Applying rule [${rule.name}]`);
                    try {
                        return rule.match({
                            ir,
                            file: filePath,
                            locale: locale,
                        });
                    } catch (error) {
                        logger.error(`Error applying rule [${rule.name}]`, error);
                        return undefined;
                    }
                })
                .filter((result) => result !== undefined);

            // if no Fixer is provided, finish immediately
            if (!this.fixer) {
                return results;
            }

            // if no Fixes were produced, accumulate current Results and finish
            /** @type {(Result & { fix: Fix })[]} */
            // @ts-expect-error: filter predicates not working in current TS version, TODO: remove once TS is updated
            const resultsWithFixes = results.filter((result) => !!result.fix);
            logger.trace(`${results.length} results produced, ${resultsWithFixes.length} with fixes`);
            const fixesAvailable = resultsWithFixes.length > 0;
            if (!fixesAvailable) {
                accumulatedResults.push(...results);
                return accumulatedResults;
            }

            // apply fixes
            try {
                this.fixer.applyFixes(
                    ir,
                    resultsWithFixes.map((result) => result.fix)
                );
            } catch (error) {
                // if the Fixer fails, accumulate current Results and finish
                logger.error(`Error applying fixes to IR [${ir.getType()}] of file [${filePath}]`, error);
                accumulatedResults.push(...results);
                return accumulatedResults;
            }

            // if no Fixes were applied, accumulate current Results and finish
            const autofixedResults = resultsWithFixes.filter((result) => result.fix.applied);
            logger.trace(`${autofixedResults.length} results autofixed`);
            const autofixesApplied = autofixedResults.length > 0;
            if (!autofixesApplied) {
                accumulatedResults.push(...results);
                return accumulatedResults;
            }

            // accumulate autofixed Results and continue
            ir.dirty = true;
            accumulatedResults.push(...autofixedResults);
            autofixIteration++;
        }

        // method should return when no more autofixes are available
        // so if we get here it means we've exceeded the maximum number of autofix iterations
        logger.error(`Exceeded maximum number of autofix iterations on IR [${ir.getType()}] of file [${filePath}]`);
        return accumulatedResults;
    }

    /**
     * Create a LintingStrategy for a given IR type
     * @param {Object} params
     * @param {string} params.type the type of IR to lint
     * @param {FileType} params.fileType the file type to lint
     * @param {boolean} [params.autofixEnabled] whether autofixing is enabled
     * @param {FixerManager} [params.fixerManager] the fixer manager to use for applying fixes
     * @param {number} [params.maxAutofixIterations] maximum number of iterations to apply autofixing to a single IR
     * @returns {LintingStrategy} a LintingStrategy for the given IR type
     */
    static create({ type, fileType, autofixEnabled, maxAutofixIterations }) {
        const rules = fileType.getRules().filter((rule) => rule.getRuleType() === type);
        const fixer = autofixEnabled ? fileType.getFixer() : undefined;
        return new LintingStrategy({
            type,
            rules,
            fixer,
            maxAutofixIterations,
        });
    }
}

export default LintingStrategy;

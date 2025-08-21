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

const logger = log4js.getLogger("ilib-lint.LintingStrategy");

const DEFAULT_MAX_AUTOFIX_ITERATIONS = 10;

/**
 * Encapsulates the logic for linting an {@link IntermediateRepresentation}.
 */
class LintingStrategy {
    /**
     * Maximum number of iterations to apply autofixing to a single IR
     * @type {number}
     */
    maxAutofixIterations;

    /**
     * Whether autofixing is enabled
     * @type {boolean}
     */
    autofixEnabled;

    /**
     * @param {Object} [params]
     * @param {number} [params.maxAutofixIterations] maximum number of iterations to apply autofixing to a single IR
     * @param {boolean} [params.autofixEnabled] whether autofixing is enabled
     */
    constructor({ maxAutofixIterations, autofixEnabled } = {}) {
        this.maxAutofixIterations = maxAutofixIterations ?? DEFAULT_MAX_AUTOFIX_ITERATIONS;
        this.autofixEnabled = autofixEnabled ?? false;
    }

    /**
     * Lint an IR using the given rules and fixer.
     *
     * This method will apply provided {@link Rule}s to the IR.
     * If the Rules produce fixes, the suppplied {@link Fixer} will be used to apply them.
     * When autofixing occurs, the method will re-apply the Rules -
     * this process will repeat until no more autofixes are applied
     * or the maximum number of iterations is reached.
     * {@link Result}s will be accumulated throughout the iterations.
     *
     * @param {Object} params
     * @param {IntermediateRepresentation} params.ir the IR to lint
     * @param {Rule[]} params.rules the rules to apply
     * @param {Fixer} [params.fixer] the fixer to use
     * @param {string} params.filePath the path to the file from which the IR was parsed
     * @param {string} [params.locale] the locale of the file from which the IR was parsed
     * @returns {Result[]} accumulated Results of the linting process
     */
    apply({ ir, rules, fixer, filePath, locale }) {
        const accumulatedResults = [];

        let autofixIteration = 0;
        while (autofixIteration < this.maxAutofixIterations) {
            // apply Rules
            logger.trace(`Linting iteration ${autofixIteration}`);
            const results = rules
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

            // if autofixing is not enabled or no Fixer is provided, finish immediately
            if (!this.autofixEnabled || !fixer) {
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
                fixer.applyFixes(
                    ir,
                    resultsWithFixes.map((result) => result.fix)
                );
            } catch (error) {
                // if the Fixer fails, accumulate current Results and bail out
                logger.error(`Error applying fixes to IR [${ir.getType()}] of file [${filePath}]`, error);
                accumulatedResults.push(...results);
                return accumulatedResults;
            }

            // check if any Fixes were applied
            const autofixedResults = resultsWithFixes.filter((result) => result.fix.applied);
            logger.trace(`${autofixedResults.length} results autofixed`);
            const autofixesApplied = autofixedResults.length > 0;
            if (autofixesApplied) {
                ir.dirty = true;
                // accumulate only autofixed Results -
                // non-autofixable Results will be recreated in the next iteration
                accumulatedResults.push(...autofixedResults);
            }

            // move to the next iteration
            autofixIteration++;
        }

        // method should return when no more autofixes are available
        // so if we get here it means we've exceeded the maximum number of autofix iterations
        logger.warn(`Exceeded maximum number of autofix iterations`);
        return accumulatedResults;
    }
}

export default LintingStrategy;

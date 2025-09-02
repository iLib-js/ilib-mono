/*
 * LintingStrategy.test.js
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

import { Fix, Fixer, IntermediateRepresentation, Result, Rule } from "ilib-lint-common";
import LintingStrategy from "../src/LintingStrategy.js";

// ESM support
const jest = import.meta.jest;

// test utilities
const testIrType = "test-type";
const testFilePath = "test/path/name";

/** Instantiate an IntermediateRepresentation */
const testIr = (/** @type {unknown} */ content = {}) => {
    return new IntermediateRepresentation({
        type: testIrType,
        ir: content,
        // @ts-expect-error: unused in test
        sourceFile: null,
    });
};

/** Create an anonymous Rule with the supplied `match` method */
const testRule = (/** @type {Rule["match"]} */ match) => {
    /** @type {Rule & { match: jest.MockedFunction<Rule["match"]> }} */
    const instance = new (class extends Rule {
        match = jest.fn(match);
        type = testIrType;
    })();
    return instance;
};

/** Instantiate a Result linking back to the supplied originRule and optionally containing a fix */
const testResult = (/** @type {Rule} */ originRule, /** @type {Fix|undefined} */ fix = undefined) => {
    return new Result({
        severity: "error",
        description: "test description",
        highlight: "test highlight",
        pathName: testFilePath,
        rule: originRule,
        fix,
    });
};

/**
 * Create an anonymous Fix with the supplied properties injected into it
 *
 * @template {Record<string, any>} T
 * @param {T | undefined} props - properties to copy into the Fix instance
 */
const testFix = (props = undefined) => {
    /** @type {Fix} */
    const fix = new (class extends Fix {
        type = testIrType;
    })();
    if (!props) {
        return fix;
    }
    // copy in the supplied properties into the anonymous Fix instance
    return Object.assign(fix, props);
};

/** Create an anonymous Fixer with the supplied `applyFixes` method */
const testFixer = (/** @type {Fixer["applyFixes"]} */ applyFixes) => {
    /** @type {Fixer & { applyFixes: jest.MockedFunction<Fixer["applyFixes"]> }} */
    const fixer = new (class extends Fixer {
        type = testIrType;
        applyFixes = jest.fn(applyFixes);
    })();
    return fixer;
};

describe("LintingStrategy", () => {
    describe("creation", () => {
        describe("constructor", () => {
            it("should throw an error if the rules don't match the type", () => {
                const rule = new (class extends Rule {
                    match = () => [];
                    type = "different-type";
                })();
                expect(() => new LintingStrategy({ type: testIrType, rules: [rule] })).toThrow();
            });

            it("should throw an error if the fixer doesn't match the type", () => {
                const fixer = new (class extends Fixer {
                    type = "different-type";
                    applyFixes = () => [];
                })();
                expect(() => new LintingStrategy({ type: testIrType, rules: [], fixer })).toThrow();
            });

            it.each([0, -1, -Infinity])("should cap the minimum number of iterations at 1", (maxAutofixIterations) => {
                const strategy = new LintingStrategy({ type: testIrType, rules: [], maxAutofixIterations });
                expect(strategy.maxAutofixIterations).toBe(1);
            });

            it("should default the maximum number of iterations to 10", () => {
                const strategy = new LintingStrategy({ type: testIrType, rules: [] });
                expect(strategy.maxAutofixIterations).toBe(10);
            });

            it("should set the maximum number of iterations to the provided value", () => {
                const maxAutofixIterations = 5;
                const strategy = new LintingStrategy({ type: testIrType, rules: [], maxAutofixIterations });
                expect(strategy.maxAutofixIterations).toBe(maxAutofixIterations);
            });

            it("should set the type to the provided type", () => {
                const type = "different-type";
                const strategy = new LintingStrategy({ type, rules: [], fixer: undefined });
                expect(strategy.type).toBe(type);
            });

            it("should set the rules to the provided rules", () => {
                const rules = [testRule(() => [])];
                const strategy = new LintingStrategy({ type: testIrType, rules });
                expect(strategy.rules).toBe(rules);
            });

            it("should set the fixer to the provided fixer", () => {
                const fixer = testFixer(() => []);
                const strategy = new LintingStrategy({ type: testIrType, rules: [], fixer });
                expect(strategy.fixer).toBe(fixer);
            });
        });
    });

    describe("rule application", () => {
        /** @type {IntermediateRepresentation} */
        let ir;

        beforeEach(() => {
            ir = testIr();
        });

        it("should apply rules to an IR", () => {
            const rule = testRule(() => []);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule] });
            strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
        });

        it("should gracefully handle rules that return undefined", () => {
            const rule = testRule(() => undefined);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule] });
            strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
        });

        it("should gracefully handle rules that throw an error", () => {
            const rule = testRule(() => {
                throw new Error("rule error");
            });

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule] });

            expect(() => {
                strategy.apply({
                    ir,
                    filePath: testFilePath,
                });
            }).not.toThrow();
            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
            // TODO: test that the error is logged
        });

        it("should gracefully handle empty rules array", () => {
            const strategy = new LintingStrategy({ type: testIrType, rules: [] });
            expect(() => {
                strategy.apply({
                    ir,
                    filePath: testFilePath,
                });
            }).not.toThrow();
        });

        it("should pass the locale to the rule", () => {
            const locale = "test-locale";

            const rule = testRule(() => []);
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule] });
            strategy.apply({
                ir,
                filePath: testFilePath,
                locale,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ locale }));
        });

        it("should pass the file path to the rule", () => {
            const differentFilePath = "different/test/path/name";

            const rule = testRule(() => []);
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule] });
            strategy.apply({
                ir,
                filePath: differentFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ file: differentFilePath }));
        });
    });

    describe("result accumulation", () => {
        /** @type {IntermediateRepresentation} */
        let ir;

        beforeEach(() => {
            ir = testIr();
        });

        it("should return empty array if no rules are provided", () => {
            const strategy = new LintingStrategy({ type: testIrType, rules: [] });
            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(0);
        });

        it("should accumulate results from multiple rules", () => {
            const rule1 = testRule(() => [testResult(rule1)]);
            const rule2 = testRule(() => [testResult(rule2)]);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule1, rule2] });
            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule1,
                    }),
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should gracefully handle rules that return an empty array", () => {
            const rule1 = testRule(() => []);
            const rule2 = testRule(() => [testResult(rule2)]);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule1, rule2] });
            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(1);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should gracefully handle rules that return undefined", () => {
            const rule1 = testRule(() => undefined);
            const rule2 = testRule(() => [testResult(rule2)]);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule1, rule2] });
            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(1);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should return accumulated results if some rules throw", () => {
            const rule1 = testRule(() => [testResult(rule1)]);
            const rule2 = testRule(() => {
                throw new Error("rule2 error");
            });
            const rule3 = testRule(() => [testResult(rule3)]);

            const strategy = new LintingStrategy({ type: testIrType, rules: [rule1, rule2, rule3] });
            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule1,
                    }),
                    expect.objectContaining({
                        rule: rule3,
                    }),
                ])
            );
            // TODO: test that the error is logged
        });
    });

    describe("autofixing", () => {
        /** @type {IntermediateRepresentation} */
        let ir;

        beforeEach(() => {
            ir = testIr();
        });

        /**
         * Test fixer which appends Fix.suffix to the IR
         *
         * It expects the Fix to contain a `suffix` property.
         */
        const suffixAppendFixer = () =>
            testFixer((ir, fixes) => {
                for (const fix of fixes) {
                    /** @type {string} */
                    // @ts-expect-error: proper Fixer would perform some validation on this Fix first
                    const suffix = fix.suffix;
                    // append to existing content
                    const currentContent = ir.ir;
                    ir.ir = currentContent + suffix;
                    // fixer should mark which Fixes were applied
                    fix.applied = true;
                }
            });

        it("should not autofix if no Fixer is provided", () => {
            const fixer = undefined;
            const fix = testFix();
            const rule = testRule(() => [testResult(rule, fix)]);
            const strategy = new LintingStrategy({
                type: testIrType,
                rules: [rule],
                fixer,
            });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(results).toHaveLength(1);
            expect(fix.applied).toBe(false);
        });

        it("should not autofix if no Fixes are produced", () => {
            const fixer = testFixer();
            const fix = undefined;
            const rule = testRule(() => [testResult(rule, fix)]);
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule], fixer });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(fixer.applyFixes).not.toHaveBeenCalled();
            expect(results).toHaveLength(1);
            expect(results[0].fix).toBeUndefined();
        });

        it("should gracefully handle the Fixer failing", () => {
            const fixer = testFixer(() => {
                throw new Error("fixer error");
            });

            const fix = testFix();
            const rule = testRule(() => [testResult(rule, fix)]);
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule], fixer });

            let results;
            expect(() => {
                results = strategy.apply({
                    ir,
                    filePath: testFilePath,
                });
            }).not.toThrow();

            expect(fixer.applyFixes).toHaveBeenCalled();
            // should still return the results
            expect(results).toHaveLength(1);
            expect(fix.applied).toBe(false);
            // TODO: test that the error is logged
        });

        it("should apply the fix to the IR", () => {
            const suffix = "-fixed";
            const ir = testIr("value");

            // once produces a Fix containing a suffix to be appended
            const rule = testRule();
            rule.match.mockReturnValueOnce([testResult(rule, testFix({ suffix }))]);

            const fixer = suffixAppendFixer();
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule], fixer });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(fixer.applyFixes).toHaveBeenCalledTimes(1);
            expect(fixer.applyFixes).toHaveBeenCalledWith(ir, expect.any(Array));
            expect(results).toHaveLength(1);
            expect(results[0].fix?.applied).toBe(true);
            expect(ir.getRepresentation()).toEqual("value-fixed");
        });

        it("should keep autofixing until no more fixes are produced", () => {
            const suffix = "-fixed";
            const ir = testIr("value");

            // twice produces a Fix containing a suffix to be appended
            const rule = testRule();
            rule.match.mockReturnValueOnce([testResult(rule, testFix({ suffix }))]);
            rule.match.mockReturnValueOnce([testResult(rule, testFix({ suffix }))]);

            const fixer = suffixAppendFixer();
            const strategy = new LintingStrategy({ type: testIrType, rules: [rule], fixer });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(fixer.applyFixes).toHaveBeenCalledTimes(2);
            expect(fixer.applyFixes).toHaveBeenCalledWith(
                ir,
                expect.arrayContaining([expect.any(Fix), expect.any(Fix)])
            );
            expect(results).toHaveLength(2);
            expect(results[0].fix?.applied).toBe(true);
            expect(results[1].fix?.applied).toBe(true);
            expect(ir.getRepresentation()).toEqual("value-fixed-fixed");
        });

        it("should stop autofixing after the maximum number of iterations is reached", () => {
            const maxIterations = 3;
            const suffix = "-fixed";
            const ir = testIr("value");

            // infinitely produces a Fix containing a suffix to be appended
            const rule = testRule();
            rule.match.mockReturnValue([testResult(rule, testFix({ suffix }))]);

            const fixer = suffixAppendFixer();
            const strategy = new LintingStrategy({
                type: testIrType,
                maxAutofixIterations: maxIterations,
                rules: [rule],
                fixer,
            });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(fixer.applyFixes).toHaveBeenCalledTimes(maxIterations);
            expect(fixer.applyFixes).toHaveBeenCalledWith(
                ir,
                expect.arrayContaining(Array(maxIterations).fill(expect.any(Fix)))
            );
            expect(results).toHaveLength(maxIterations);
            expect(results[0].fix?.applied).toBe(true);
            expect(results[1].fix?.applied).toBe(true);
            expect(results[2].fix?.applied).toBe(true);
            expect(ir.getRepresentation()).toEqual("value-fixed-fixed-fixed");
            // TODO: test that a warning about exceeding the maximum number of iterations is logged
        });

        it("should stop autofixing if no Fixes were actually applied", () => {
            const suffix = "-fixed";
            const ir = testIr("value");

            // infinitely produces a Fix containing a suffix to be appended
            const rule = testRule();
            rule.match.mockReturnValue([testResult(rule, testFix({ suffix }))]);

            // fixer which does nothing
            const fixer = testFixer(() => {});
            const strategy = new LintingStrategy({
                type: testIrType,
                rules: [rule],
                fixer,
            });

            const results = strategy.apply({
                ir,
                filePath: testFilePath,
            });

            expect(fixer.applyFixes).toHaveBeenCalledTimes(1);
            expect(fixer.applyFixes).toHaveBeenCalledWith(ir, expect.arrayContaining([expect.any(Fix)]));
            expect(results).toHaveLength(1);
            expect(results[0].fix?.applied).toBe(false);
            expect(ir.getRepresentation()).toEqual("value");
        });
    });
});

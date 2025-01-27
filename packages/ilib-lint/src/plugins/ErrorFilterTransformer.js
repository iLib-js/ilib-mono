/*
 * ErrorFilterTransformer - transform an intermediate representation
 * by filtering out errors
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

import { ResourceXliff } from 'ilib-tools-common';
import { IntermediateRepresentation, SourceFile, Transformer, Result, FileStats } from 'ilib-lint-common';

/**
 * Filter out errors from the intermediate representation.
 */
class ErrorFilterTransformer extends Transformer {
    /**
     * Create a new transformer instance.
     */
    constructor(options) {
        super(options);
    }

    /**
     * Filter out errors from the intermediate representation.
     *
     * @param {IntermediateRepresentation} ir the intermediate representation to filter
     * @param {Result[]|undefined} results the results of the linting process
     * @returns {IntermediateRepresentation} the filtered intermediate representation
     */
    transform(ir, results) {
        if (ir.getType() !== 'resource' || !results) {
            return ir;
        }
        const resources = ir.getRepresentation();
        const resultIndex = {};
        results.forEach(result => {
            resultIndex[result.id] = result;
        });
        const filteredResources = resources.filter(resource => {
            const result = resultIndex[resource.getKey()];
            return !result || result.severity !== 'error';
        });
        return new IntermediateRepresentation({
            type: ir.getType(),
            ir: filteredResources,
            sourceFile: ir.getSourceFile()
        });
    }
};

export default ErrorFilterTransformer;
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

import { IntermediateRepresentation, Transformer, Result } from 'ilib-lint-common';
import { Resource } from 'ilib-tools-common';

/**
 * Filter out errors from the intermediate representation.
 */
class ErrorFilterTransformer extends Transformer {
    /**
     * Create a new transformer instance.
     */
    constructor(options) {
        super(options);
        this.name = "errorfilter";
        this.description = "Filter out translation units that have errors from the resources representation.";
        this.type = "resource";
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
        // don't filter out results that have been auto-fixed!
        const hashesToExclude = results.filter(result => result.id && result.severity === 'error' && !result.fix?.applied).
            map(result => [result.id, result.locale, result.pathName].join('_'));
        const filteredResources = resources.filter(/** @type Resource */ resource => {
            const filePath = resource.getResFile() ?? resource.getPath();
            const hash = [resource.getKey(), resource.getTargetLocale(), filePath].join('_');
            return !hashesToExclude.includes(hash);
        });
        return new IntermediateRepresentation({
            type: ir.getType(),
            ir: filteredResources,
            sourceFile: ir.getSourceFile(),
            dirty: (filteredResources.length !== resources.length)
        });
    }
};

export default ErrorFilterTransformer;
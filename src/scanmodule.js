/*
 * scanmodule.js - scan an ilib module for locale data
 *
 * Copyright © 2022 JEDLSoft
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

import { createRequire } from 'module';
import { existsSync } from 'node:fs';
import path from 'path';

const require = createRequire(import.meta.url);

/**
 * Scan an ilib module for locale data. This operates by loading
 * the module asynchronously, and then asking it if there is any
 * locale data. Specifically, it loads the js file called
 * "<module>/assemble.mjs" which should come with every ilib
 * package that publishes locale data. The idea is that each
 * module should be an expert in how its own locale data should
 * be published. This allows ilib modules to be updated and
 * to add new modules without needing to update ilib-assemble.
 *
 * If the assemble.mjs does not exist in the package
 * or could otherwise not be loaded, then that module is skipped.
 * For example, modules such as `ilib-env` which do not contain any
 * locale data, and therefore do not need an assemble.mjs file in
 * them and will be quietly skipped.<p>
 *
 * The assemble.mjs module should be a node module that
 * exports a default assemble function with the signature:
 *
 * <code>
 * function assemble(options: Object): Promise
 * </code>
 *
 * That is, it takes an options object that can contain various
 * configuration options. The main options is the "locales" parameter
 * which is an array of locales to process.
 * It is expected that the assemble function will also include
 * all the merged data for sublocales. That is, if the array of
 * locales to process include the locale "de-DE", then all the data
 * for "de", "und-DE", and "de-DE" will be assembled together in
 * one merged piece fo data. See the function `getSublocales` in the
 * the ilib module `ilib-common` for details on how the sublocales
 * work.<p>
 *
 * Loading js modules dynamically can only be accomplished using
 * asynchronous loading. Therefore, this function is
 * also asynchronous and returns a promise to load the data. The
 * assemble function in each module should also be asynchronous
 * and return its own promise that is added to the current one.<p>
 *
 * Locale data should be returned from the promise in a localeData
 * object in the following simple format:
 *
 * <code>
 * {
 *   "locale": {
 *     "basename": {
 *       locale data here
 *     }
 *   }
 * }
 * </code>
 *
 * That is, the top level properties are the locales from the
 * options.locales array. Inside of each locale object is a
 * basename for the data type. Inside of there is the actual
 * locale data. If a property at any level does not exist yet,
 * the assemble function should add and populate it. See the
 * documentation for the `ilib-localedata` package for more details
 * on how this data is structured and loaded.<p>
 *
 * @param {string} moduleName the name of the ilib module to scan
 * @param {Object} options options from the command-line
 * @returns {Promise} a promise to scan and load all the locale
 * data, and return it in the format documented above
 */
function scanModule(moduleName, options) {
    let resolved = moduleName;
    if ( moduleName[0] !== '.' && moduleName[0] !== '/') {
        try {
            resolved = require.resolve(moduleName);
            const i = resolved.indexOf(moduleName);
            resolved = resolved.substring(0, i + moduleName.length);
        } catch (e) {
            console.log(`    Error: could not find module ${moduleName}`);
            return Promise.resolve(null);
        }
    }

    if (!existsSync(path.join(resolved, "assemble.mjs")) || !existsSync(path.join(resolved, "locale"))) {
        if (!options || !options.quiet) console.log(`    No locale data available for module ${moduleName}`);
        return Promise.resolve(true);
    }

    return import(`${moduleName}/assemble.mjs`).then(module => {
        if (!options || !options.quiet) console.log(`    Returning data for module ${moduleName}`);
        const assemble = module && module.default;
        if (assemble && typeof(assemble) === 'function') {
            // should return a promise of its own
            return assemble(options);
        }
        return Promise.resolve(false);
    }).catch(err => {
        console.log(err);
        return Promise.resolve(false);
    });
}

export default scanModule;

/*
 * index.js - main entry point for the javascript plugin
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

import { Plugin } from 'ilib-lint-common';

import ILibPluralSyntaxChecker from './ILibPluralSyntaxChecker.js';

class JavascriptPlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    /** @override */
    init() {
    }

    /** @override */
    getRules() {
        return [
            ILibPluralSyntaxChecker
        ];
    }

    /** @override */
    getRuleSets() {
        return {
            "ilib": {
                "resource-ilib-plural-syntax-checker": true,
                // named parameters have the same syntax as react, so just use the generic rule
                "resource-named-params": true
            }
        };
    }
}

export default JavascriptPlugin;
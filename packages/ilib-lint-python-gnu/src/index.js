/*
 * index.js - main program of python gnu plugin
 *
 * Copyright © 2022, 2024 JEDLSoft
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

import POParser from './POParser.js';
import PrintfMatchRule from './PrintfMatchRule.js';
import PrintfNumberedRule from './PrintfNumberedRule.js';

class PythonPlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    /** @override */
    init() {
        //console.log("PythonPlugin.init() called");
    }

    /** @override */
    getRules() {
        //console.log("PythonPlugin.getRules() called");
        return [ PrintfMatchRule, PrintfNumberedRule ];
    }

    /** @override */
    getRuleSets() {
        return {
            "python-gnu": {
                "resource-printf-params-match": true,
                "resource-printf-params-numbered": true
            }
        };
    }

    /** @override */
    getParsers() {
        //console.log("PythonPlugin.getParsers() called");
        return [ POParser ];
    }
}

export default PythonPlugin;
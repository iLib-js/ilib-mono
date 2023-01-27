/*
 * index.js - main program of python gnu plugin
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

import { Plugin } from 'i18nlint-common';

import FStringMatchRule from './FStringMatchRule.js';
import FStringNumberedRule from './FStringNumberedRule.js';
import LegacyMatchRule from './LegacyMatchRule.js';

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
        return [ FStringMatchRule, FStringNumberedRule, LegacyMatchRule ];
    }

    /** @override */
    getRuleSets() {
        return {
            "python": {
                "resource-python-fstrings-match": true,
                "resource-python-fstrings-numbered": true,
                "resource-python-legacy-match": true
            }
        };
    }
}

export default PythonPlugin;
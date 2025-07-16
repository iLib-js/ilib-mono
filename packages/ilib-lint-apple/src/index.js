/*
 * index.js - main entry point for ilib-lint-apple plugin
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

import SwiftParams from './rules/SwiftParams.js';

class ApplePlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    /** @override */
    init() {
        //console.log("ApplePlugin.init() called");
    }

    /** @override */
    getRules() {
        //console.log("ApplePlugin.getRules() called");
        return [ SwiftParams ];
    }

    /** @override */
    getRuleSets() {
        return {
            "apple": {
                "resource-swift-params": true
            }
        };
    }
}

export default ApplePlugin; 
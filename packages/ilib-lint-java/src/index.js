/*
 * index.js - main entry point for the java plugin
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

import ResourceJavaParams from './ResourceJavaParams.js';
import ResourceKotlinParams from './ResourceKotlinParams.js';

class JavaPlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    /** @override */
    init() {
    }

    /** @override */
    getRules() {
        return [
            ResourceJavaParams,
            ResourceKotlinParams
        ];
    }

    /** @override */
    getRuleSets() {
        return {
            "java": {
                "resource-java-params": true
            },
            "kotlin": {
                "resource-kotlin-params": true
            }
        };
    }
}

export default JavaPlugin;
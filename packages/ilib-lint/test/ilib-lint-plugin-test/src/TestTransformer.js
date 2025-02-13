/*
 * TestTransformer.js - test an ilib-lint Transformer plugin
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

import { Transformer, SourceFile } from 'ilib-lint-common';

class TestTransformer extends Transformer {
    constructor(options) {
        super(options);
        this.overwrite = options?.opt?.overwrite ?? false;
        this.name = "transformer-xyz";
        this.description = "A test transformer for xyz files, which are really just json files.";
        this.type = "resource";
    }

    init() {
        console.log("TestTransformer.init called");
    }

    transform(ir, results) {
        console.log("TestTransformer.transform called");
        // just return the ir unchanged
        return ir;
    }
}

export default TestTransformer;

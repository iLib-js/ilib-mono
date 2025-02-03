/*
 * TestSerializer.js - test an ilib-lint Serializer plugin
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

import { Serializer, SourceFile } from 'ilib-lint-common';

class TestSerializer extends Serializer {
    constructor(options) {
        super(options);
        this.overwrite = options?.opt?.overwrite ?? false;
        this.name = "serializer-xyz";
        this.description = "A test serializer for xyz files, which are really just json files.";
        this.type = "resource";
    }

    init() {
        console.log("TestSerializer.init called");
    }

    serialize(ir) {
        const data = ir?.getRepresentation();
        if (!ir || !data || !Array.isArray(data) || data.length === 0) {
            throw new Error("ilib-lint-plugin-test: attempt to serialize empty data");
        }

        const json = {};
        data.forEach(resource => {
            json[resource.getSource()] = resource.getTarget();
        });
        const jsonString = JSON.stringify(json, null, 4);

        const fileName = ir.getSourceFile().getPath() + (this.overwrite ? "" : ".modified");

        return new SourceFile(fileName, {
            file: ir.getSourceFile(),
            content: jsonString
        });
    }
}

export default TestSerializer;

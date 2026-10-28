/*
 * ZoneWriterFactory.test.ts - unit tests for createZoneWriter
 *
 * Copyright © 2026 JEDLSoft
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

import { createZoneWriter } from "../src/ZoneWriterFactory";
import { JsonZoneWriter } from "../src/JsonZoneWriter";
import { ZoneWriter } from "../src/ZoneWriter";

describe("createZoneWriter", () => {
    test("returns a JsonZoneWriter for json", () => {
        expect.assertions(2);
        const writer = createZoneWriter("json", "/tmp/out");
        expect(writer).toBeInstanceOf(JsonZoneWriter);
        expect(writer).toBeInstanceOf(ZoneWriter);
    });

    test("matches type case-insensitively", () => {
        expect.assertions(2);
        expect(createZoneWriter("JSON", "/tmp/out")).toBeInstanceOf(
            JsonZoneWriter
        );
        expect(createZoneWriter("Json", "/tmp/out")).toBeInstanceOf(
            JsonZoneWriter
        );
    });

    test("returns null for an unsupported type", () => {
        expect.assertions(2);
        expect(createZoneWriter("xml", "/tmp/out")).toBeNull();
        expect(createZoneWriter("", "/tmp/out")).toBeNull();
    });
});

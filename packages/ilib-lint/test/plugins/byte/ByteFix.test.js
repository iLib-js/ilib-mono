/*
 * ByteFix.test.js
 *
 * Copyright © 2025 Box, Inc.
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

import PositionalFixCommand from "../../../src/plugins/positional/PositionalFixCommand.js";
import ByteFix from "../../../src/plugins/byte/ByteFix.js";

describe("testByteFix", () => {
    test("ByteFixCtorShouldThrowOverlappingCommands", () => {
        expect.assertions(1);
        // overlapping commands in a single fix
        expect(
            () =>
                new ByteFix(
                    // replace 1st and 2nd byte
                    new PositionalFixCommand(0, 2, Buffer.from([0x00, 0x01])),
                    // replace 1st byte
                    new PositionalFixCommand(1, 1, Buffer.from([0x02]))
                )
        ).toThrow();
    });

    test("StringFixShouldDetectOverlap", () => {
        expect.assertions(2);
        // fixes overlap because some commands between them overlap
        const one = new ByteFix(
            // replace 1st and 2nd byte
            new PositionalFixCommand(0, 2, Buffer.from([0x00, 0x01]))
        );
        const other = new ByteFix(
            // replace 1st byte
            new PositionalFixCommand(1, 1, Buffer.from([0x02]))
        );
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("StringFixShouldDetectOverlapOfAnyCommands", () => {
        expect.assertions(2);
        // fixes overlap because some commands between them overlap
        // even if not all commands do
        const one = new ByteFix(
            new PositionalFixCommand(0, 2, Buffer.from([0x00, 0x01])),
            new PositionalFixCommand(4, 2, Buffer.from([0x02, 0x03]))
        );
        const other = new ByteFix(
            // no overlap
            new PositionalFixCommand(2, 1, Buffer.from([0x03])),
            // overlap with [4,6]
            new PositionalFixCommand(5, 1, Buffer.from([0x04]))
        );
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });
});

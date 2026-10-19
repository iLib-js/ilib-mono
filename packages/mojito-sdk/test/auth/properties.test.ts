/*
 * properties.test.ts - unit tests for Spring-style properties parsing
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Properties } from "../../src/auth/properties";

describe("Properties", () => {
    test("parses keys, ignores comments, and supports a colon separator", () => {
        const props = Properties.parse(`
# comment
l10n.resttemplate.host=example.com
l10n.resttemplate.port: 443
! another comment

not a pair
=nokey
`);
        expect(props.get("l10n.resttemplate.host")).toBe("example.com");
        expect(props.get("l10n.resttemplate.port")).toBe("443");
        expect(props.has("l10n.resttemplate.host")).toBe(true);
        expect(props.get("missing")).toBeUndefined();
        expect(props.size).toBe(2);
    });

    test("keeps the first separator so the value may contain = or :", () => {
        const props = Properties.parse(`
url=http://example.com:8080/path
token:abc=def:ghi
`);
        expect(props.get("url")).toBe("http://example.com:8080/path");
        expect(props.get("token")).toBe("abc=def:ghi");
    });

    test("trims keys and values and lets a later key win", () => {
        const props = Properties.parse(`
  host = first 
host=second
empty=
`);
        expect(props.get("host")).toBe("second");
        expect(props.get("empty")).toBe("");
        expect(props.has("empty")).toBe(true);
        expect(props.entries()).toEqual([
            ["host", "second"],
            ["empty", ""],
        ]);
    });

    test("from and toRecord round-trip the parsed map", () => {
        const props = Properties.from({
            "l10n.resttemplate.host": "example.com",
            "l10n.resttemplate.port": "443",
        });
        expect(props.toRecord()).toEqual({
            "l10n.resttemplate.host": "example.com",
            "l10n.resttemplate.port": "443",
        });
        props.toRecord()["l10n.resttemplate.host"] = "mutated";
        expect(props.get("l10n.resttemplate.host")).toBe("example.com");
    });

    test("merge lets the other set override overlapping keys", () => {
        const base = Properties.parse("host=base\nport=8080\n");
        const overlay = Properties.parse("host=overlay\nscheme=https\n");
        const merged = base.merge(overlay);

        expect(merged.get("host")).toBe("overlay");
        expect(merged.get("port")).toBe("8080");
        expect(merged.get("scheme")).toBe("https");
        expect(base.get("host")).toBe("base");
    });

    test("empty has no keys", () => {
        const props = Properties.empty();
        expect(props.size).toBe(0);
        expect(props.toRecord()).toEqual({});
        expect(props.entries()).toEqual([]);
    });
});

/*
 * XliffSerializer.test.js - test the built-in XliffSerializer plugin
 *
 * Copyright © 2024 JEDLSoft
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
import fs from 'fs';

import { ResourceArray, ResourcePlural, ResourceString } from 'ilib-tools-common';

import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import XliffParser from '../src/plugins/XliffParser.js';
import XliffSerializer from '../src/plugins/XliffSerializer.js';

describe("test the XliffParser plugin", () => {
    test("No arg constructor gives default values", () => {
        expect.assertions(3);

        const xs = new XliffSerializer();

        expect(xs.getDescription()).toBe("A serializer for xliff files. This can handle xliff v1.2 and v2.0 format files.");
        expect(xs.getType()).toBe("resource");
        expect(xs.getName()).toBe("xliff");
    });

    test("Serialize a regular xliff file", () => {
        expect.assertions(3);

        const sourceFile = new SourceFile("test/testfiles/xliff/test.xliff", {});

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [
                new ResourceString({
                    source: "Asdf asdf",
                    sourceLocale: "en-US",
                    target: "Asdf asdf in German",
                    targetLocale: "de-DE",
                    key: "foobar",
                    datatype: "plaintext",
                    restype: "string",
                    project: "webapp",
                    pathName: "foo/bar/asdf.java",
                    comment: "foobar is where it's at!"
                })
            ],
            sourceFile
        });

        const xs = new XliffSerializer();
        const newSourceFile = xs.serialize(ir);
        expect(newSourceFile).toBeTruthy();
        expect(newSourceFile.getPath()).toBe(sourceFile.getPath());
        expect(newSourceFile.getContent()).toBe(
`<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2">
  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">
    <body>
      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">
        <source>Asdf asdf</source>
        <target>Asdf asdf in German</target>
        <note>foobar is where it's at!</note>
      </trans-unit>
    </body>
  </file>
</xliff>`);
    });

    test("Serialize a regular xliff file with multiple resources", () => {
        expect.assertions(3);

        const sourceFile = new SourceFile("test/testfiles/xliff/test.xliff", {});

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [
                new ResourceString({
                    source: "Asdf asdf",
                    sourceLocale: "en-US",
                    target: "Asdf asdf in German",
                    targetLocale: "de-DE",
                    key: "foobar",
                    datatype: "plaintext",
                    restype: "string",
                    project: "webapp",
                    pathName: "foo/bar/asdf.java",
                    comment: "foobar is where it's at!"
                }),
                new ResourcePlural({
                    source: {
                        one: "You have one message.",
                        other: "You have {n} messages."
                    },
                    sourceLocale: "en-US",
                    target: {
                        one: "Sie haben eine Nachricht.",
                        other: "Sie haben {n} Nachrichten."
                    },
                    targetLocale: "de-DE",
                    key: "messages",
                    datatype: "plaintext",
                    restype: "plural",
                    project: "webapp",
                    pathName: "foo/bar/asdf.java",
                    comment: "messages are important"
                }),
                new ResourceArray({
                    source: ["one", "two", "three"],
                    sourceLocale: "en-US",
                    target: ["eins", "zwei", "drei"],
                    targetLocale: "de-DE",
                    key: "numbers",
                    datatype: "plaintext",
                    restype: "array",
                    project: "webapp",
                    pathName: "foo/bar/asdf.java",
                    comment: "numbers are numbers"
                })
            ],
            sourceFile
        });

        const xs = new XliffSerializer();
        const newSourceFile = xs.serialize(ir);
        expect(newSourceFile).toBeTruthy();
        expect(newSourceFile.getPath()).toBe(sourceFile.getPath());
        expect(newSourceFile.getContent()).toBe(
`<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2">
  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">
    <body>
      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">
        <source>Asdf asdf</source>
        <target>Asdf asdf in German</target>
        <note>foobar is where it's at!</note>
      </trans-unit>
      <trans-unit id="2" resname="messages" restype="plural" datatype="plaintext" extype="one">
        <source>You have one message.</source>
        <target>Sie haben eine Nachricht.</target>
        <note>messages are important</note>
      </trans-unit>
      <trans-unit id="3" resname="messages" restype="plural" datatype="plaintext" extype="other">
        <source>You have {n} messages.</source>
        <target>Sie haben {n} Nachrichten.</target>
        <note>messages are important</note>
      </trans-unit>
      <trans-unit id="4" resname="numbers" restype="array" datatype="plaintext" extype="0">
        <source>one</source>
        <target>eins</target>
        <note>numbers are numbers</note>
      </trans-unit>
      <trans-unit id="5" resname="numbers" restype="array" datatype="plaintext" extype="1">
        <source>two</source>
        <target>zwei</target>
        <note>numbers are numbers</note>
      </trans-unit>
      <trans-unit id="6" resname="numbers" restype="array" datatype="plaintext" extype="2">
        <source>three</source>
        <target>drei</target>
        <note>numbers are numbers</note>
      </trans-unit>
    </body>
  </file>
</xliff>`);

    });
});

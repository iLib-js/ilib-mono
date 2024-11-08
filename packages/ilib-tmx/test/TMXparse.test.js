/*
 * TMXparse.test.js - test the parsing capabilities of the TMX object.
 *
 * Copyright © 2024 Box, Inc.
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

import * as path from 'path';
import * as fs from 'fs';
import TMX from '../src/tmx.js';
import { Path } from 'ilib-common';

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

function diff(a, b) {
    const min = Math.min(a.length, b.length);

    for (let i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

describe("testTMXparse", () => {
    test("TMXParse", () => {
        expect.assertions(4);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);
    });

    test("TMXParseRightUnits", () => {
        expect.assertions(10);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXParseManyVariants", () => {
        expect.assertions(14);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>one two three</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                  <tuv xml:lang="fr-FR">
                    <seg>un deu trois</seg>
                  </tuv>
                  <tuv xml:lang="es-ES">
                    <seg>uno dos tres</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].source).toBe("one two three");
        expect(units[0].sourceLocale).toBe("en-US");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(4);

        expect(variants[0].string).toBe("one two three");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("un deu trois");
        expect(variants[2].locale).toBe("fr-FR");

        expect(variants[3].string).toBe("uno dos tres");
        expect(variants[3].locale).toBe("es-ES");
    });

    test("TMXParseHeaders", () => {
        expect.assertions(8);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="asdf" creationtool="mytool" creationtoolversion="1.2.3" adminlang="en-US" srclang="de-DE" datatype="golang"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <prop type="datatype">java</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const props = tmx.getProperties();

        expect(props.segtype).toBe("asdf");
        expect(props.creationtool).toBe("mytool");
        expect(props.creationtoolversion).toBe("1.2.3");
        expect(props.adminlang).toBe("en-US");
        expect(props.srclang).toBe("de-DE");
        expect(props.datatype).toBe("golang");

        expect(tmx.sourceLocale).toBe("de-DE");
    });

    test("TMXParseProperties", () => {
        expect.assertions(3);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <prop type="datatype">java</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].getProperties()).toStrictEqual({
            "x-project": "webapp",
            "datatype": "java"
        });
    });

    test("TMXParseNotes", () => {
        expect.assertions(3);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <note>This is a comment</note>
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].comment).toStrictEqual("This is a comment");
    });

    test("TMXParseDifferentVersion", () => {
        expect.assertions(4);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.5">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        // cannot parse tmx > v1.4 files
        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(0);
    });

    test("TMXParseMultipleUnits", () => {
        expect.assertions(18);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>seven ate nine</seg>
                  </tuv>
                  <tuv xml:lang="de-DE">
                    <seg>sieben acht neun</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].source).toBe("seven ate nine");
        expect(units[1].sourceLocale).toBe("en-US");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("seven ate nine");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("sieben acht neun");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TMXParseNoTranslations", () => {
        expect.assertions(8);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv xml:lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        let variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TMXParseLangAttrs", () => {
        expect.assertions(10);

        const tmx = new TMX();
        expect(tmx).toBeTruthy();

        const xml = `
            <?xml version="1.0" encoding="utf-8"?>
            <tmx version="1.4">
              <header segtype="paragraph" creationtool="loctool" creationtoolversion="1.0.0" adminlang="en-US" datatype="javascript"/>
              <body>
                <tu srclang="en-US">
                  <prop type="x-project">webapp</prop>
                  <tuv lang="en-US">
                    <seg>Asdf asdf</seg>
                  </tuv>
                  <tuv lang="de-DE">
                    <seg>eins zwei drei</seg>
                  </tuv>
                </tu>
              </body>
            </tmx>`;

        tmx.deserialize(xml);
        const units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();

        expect(units[0].source).toBe("Asdf asdf");
        expect(units[0].sourceLocale).toBe("en-US");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });


});

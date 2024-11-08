/*
 * TMXdiff.test.js - test the TMX diff method.
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

import path from 'path';
import fs from 'fs';
import {
    ResourceString,
    ResourceArray,
    ResourcePlural
} from 'ilib-tools-common';
import { Path } from 'ilib-common';

import TMX from '../src/tmx.js';

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

const loctoolVersion = JSON.parse(fs.readFileSync(Path.join(__dirname, "..", "package.json"), "utf-8")).version;

describe("testTMXdiff", () => {
    test("TMXDiffEmpty", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        const d = tmx1.diff(tmx2);

        expect(d).toBeTruthy();
        expect(d.size()).toBe(0);
    });

    test("TMXDiffNoDiff", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        // they have the same strings in them, so there should be no diff
        const d = tmx1.diff(tmx2);

        expect(d).toBeTruthy();
        expect(d.size()).toBe(0);
    });

    test("TMXDiffAdditionalStringInTarget", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "foobar foo",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "das foobar"
        });
        tmx2.addResource(res);

        const d = tmx1.diff(tmx2);
        expect(d).toBeTruthy();
        expect(d.size()).toBe(1);
    });

    test("TMXDiffAdditionalStringRightContentsInTarget", () => {
        expect.assertions(14);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "foobar foo",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "das foobar"
        });
        tmx2.addResource(res);

        const d = tmx1.diff(tmx2);

        const units = d.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);
        expect(units[0].sourceLocale).toBe("en");
        expect(units[0].source).toBe("foobar foo");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);
        expect(variants[0].locale).toBe("en");
        expect(variants[0].string).toBe("foobar foo");
        expect(variants[1].locale).toBe("de-DE");
        expect(variants[1].string).toBe("das foobar");
    });

    test("TMXDiffAdditionalVariantInTarget", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deux trois"
        });
        tmx2.addResource(res);

        const d = tmx1.diff(tmx2);
        expect(d).toBeTruthy();
        expect(d.size()).toBe(1);
    });

    test("TMXDiffAdditionalVariantRightContentsInTarget", () => {
        expect.assertions(14);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deux trois"
        });
        tmx2.addResource(res);

        const d = tmx1.diff(tmx2);

        const units = d.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(1);

        // source is the same, but the variants differ
        expect(units[0].sourceLocale).toBe("en");
        expect(units[0].source).toBe("Asdf asdf");

        const variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(Array.isArray(variants)).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].locale).toBe("en");
        expect(variants[0].string).toBe("Asdf asdf");

        expect(variants[1].locale).toBe("fr-FR");
        expect(variants[1].string).toBe("un deux trois");
    });

    test("TMXDiffAdditionalStringInSource", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "foobar foo",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "das foobar"
        });
        tmx1.addResource(res);

        // we don't care about deletions from the current to the new tmx,
        // only additions and changes
        const d = tmx1.diff(tmx2);
        expect(d).toBeTruthy();
        expect(d.size()).toBe(0);
    });

    test("TMXDiffAdditionalStringRightContentsInSource", () => {
        expect.assertions(5);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "foobar foo",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "das foobar"
        });
        tmx1.addResource(res);

        const d = tmx1.diff(tmx2);

        // we don't care about deletions from the current to the new tmx,
        // only additions and changes
        const units = d.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(0);
    });

    test("TMXDiffAdditionalVariantInSource", () => {
        expect.assertions(4);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deux trois"
        });
        tmx1.addResource(res);

        // we don't care about deletions from the current to the new tmx,
        // only additions and changes
        const d = tmx1.diff(tmx2);
        expect(d).toBeTruthy();
        expect(d.size()).toBe(0);
    });

    test("TMXDiffAdditionalVariantRightContentsInSource", () => {
        expect.assertions(5);

        const tmx1 = new TMX();
        expect(tmx1).toBeTruthy();
        const tmx2 = new TMX();
        expect(tmx2).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx1.addResource(res);
        tmx2.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deux trois"
        });
        tmx1.addResource(res);

        const d = tmx1.diff(tmx2);

        const units = d.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(Array.isArray(units)).toBeTruthy();
        expect(units.length).toBe(0);
    });
});

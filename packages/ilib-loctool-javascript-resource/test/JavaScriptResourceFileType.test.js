/*
 * JavaScriptResourceFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2019, 2022-2023 Box, Inc.
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

if (!JavaScriptResourceFileType) {
    var JavaScriptResourceFileType = require("../JavaScriptResourceFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

describe("javascriptresourcefiletype", function() {
    test("JavaScriptResourceFileTypeConstructor", function() {
        expect.assertions(1);

        var htf = new JavaScriptResourceFileType(p);

        expect(htf).toBeTruthy();
    });

    test("JavaScriptResourceFileTypeHandlesJS", function() {
        expect.assertions(2);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.js")).toBeTruthy();
    });

    test("JavaScriptResourceFileTypeHandlesActualJSResFile", function() {
        expect.assertions(2);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("localized_js/de-DE.js")).toBeTruthy();
    });

    test("JavaScriptResourceFileTypeHandlesAnythingFalse", function() {
        expect.assertions(4);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.tmpl.html")).toBeTruthy();
        expect(!htf.handles("foo.html.haml")).toBeTruthy();
        expect(!htf.handles("foo.yml")).toBeTruthy();
    });

    test("JavaScriptResourceFileTypeGetResourceFile", function() {
        expect.assertions(2);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        var jsrf = htf.getResourceFile({ locale: "fr-FR" });

        expect(jsrf.getLocale().toString()).toBe("fr-FR");
    });

    test("JavaScriptResourceFileTypeGetResourceFileSameOneEachTime", function() {
        expect.assertions(4);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        var jsrf1 = htf.getResourceFile({ locale: "fr-FR" });
        expect(jsrf1.getLocale().toString()).toBe("fr-FR");

        var jsrf2 = htf.getResourceFile({ locale: "fr-FR" });
        expect(jsrf2.getLocale().toString()).toBe("fr-FR");

        expect(jsrf1).toStrictEqual(jsrf2);
    });

    test("JavaScriptResourceFileTypeGetResourceFileDifferentOneForDifferentPaths", function() {
        expect.assertions(4);

        var htf = new JavaScriptResourceFileType(p);
        expect(htf).toBeTruthy();

        var jsrf1 = htf.getResourceFile({ locale: "fr-FR", pathName: "fr/FR/foo.json" });
        expect(jsrf1.getLocale().toString()).toBe("fr-FR");

        var jsrf2 = htf.getResourceFile({ locale: "fr-FR", pathName: "sublibrary/fr/FR/foo.json" });
        expect(jsrf2.getLocale().toString()).toBe("fr-FR");

        expect(jsrf1).not.toBe(jsrf2);
    });
});

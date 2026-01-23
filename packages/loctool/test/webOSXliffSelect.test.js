/*
 * XliffSelect.test.js - test the select of webOSXliff object.
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

var XliffSelect = require("../lib/XliffSelect.js");

describe("xliff select translation units in webOSXliff", function() {
    test("Select everything", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff",
            ],
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="app2_f2" original="app2">\n' +
        '    <group id="app2_g3" name="javascript">\n' +
        '      <unit id="app2_g3_1">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_g3_2">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with max units", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff",
            ],
            criteria: "maxunits:2"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });

    test("Select with max source words", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            criteria: "maxsource:8"
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with max target words", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            criteria: "maxtarget:8"
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with simple field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            criteria: "source=1a"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with regex field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            criteria: "source=^app1:.*a$"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with regex field criteria multiple results", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff",
            ],
            criteria: "source=^app2"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app2_f1" original="app2">\n' +
        '    <group id="app2_g1" name="javascript">\n' +
        '      <unit id="app2_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });

    test("Select with multiple criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            criteria: "source=1,targetLocale=en-US,datatype=x-json"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="x-json">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select while avoiding duplicated file names", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff", // should only read this file once
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ]
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });


});

describe("xliff exclude translation units in webOSXliff", function() {
    test("Exclude everything", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: ""
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        expect(target.getTranslationUnits().length).toBe(0);
    });

    test("Exclude with max unitss", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "maxunits:2"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="x-json">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with max source words", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "maxsource:8"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        expect(target.getTranslationUnits().length).toBe(0);
    });

    test("Exclude with max target words", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "maxtarget:8"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        expect(target.getTranslationUnits().length).toBe(0);
    });

    test("Exclude with field criteria", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=1a"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with field criteria 2", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/select/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=OK"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="x-json">\n' +
        '      <unit id="app1_g1_1" name="OK2">\n' +
        '        <segment>\n' +
        '          <source>Done</source>\n' +
        '          <target>Done</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with field criteria 3", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/select/en-US.xliff"
            ],
            notEqual: true,
            criteria: "key=OK2"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>OK</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with regex field criteria", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=^app1:.*a$"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with regex field criteria multiple results", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=^app2"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with multiple criteria", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=1,datatype=x-json"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with multiple criteria 2", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/select/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=OK,key=OK2"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>OK</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1" name="OK2">\n' +
        '        <segment>\n' +
        '          <source>Done</source>\n' +
        '          <target>Done</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude while avoiding duplicated file names", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app1/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=1a"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Exclude with multiple input files", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff"
            ],
            notEqual: true,
            criteria: "source=1a"
        };
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-US" version="2.0">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_g2_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

});


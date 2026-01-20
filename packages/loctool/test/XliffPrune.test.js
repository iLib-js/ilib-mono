/*
 * XliffPrune.test.js - test the merge of Xliff object.
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
var fs = require("fs");

var Xliff = require("../lib/Xliff.js");
var XliffPrune = require("../lib/XliffPrune.js");

describe("xliff prune criteria parser", function() {
    test("simple criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("state=Accepted");
        var expected = {
            fields: {
                state: /Accepted/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("regex criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("state=^app.*$");
        var expected = {
            fields: {
                state: /^app.*$/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("regex criteria with equals in it", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("state=^app.*=\\d$");
        var expected = {
            fields: {
                state: /^app.*=\d$/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("source category criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("source.one=foo");
        var expected = {
            fields: {
                source: /foo/
            },
            category: "one"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("target category criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("target.other=foo");
        var expected = {
            fields: {
                target: /foo/
            },
            category: "other"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("source array criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("source.2=foo");
        var expected = {
            fields: {
                source: /foo/
            },
            index: 2
        };
        expect(actual).toStrictEqual(expected);
    });

    test("target category criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("target.4=foo");
        var expected = {
            fields: {
                target: /foo/
            },
            index: 4
        };
        expect(actual).toStrictEqual(expected);
    });

    test("unknown field name", function() {
        expect.assertions(1);

        expect(function() {
            XliffPrune.parseCriteria("bar=foo");
        }).toThrow();
    });

    test("unknown category name", function() {
        expect.assertions(1);

        expect(function() {
            XliffPrune.parseCriteria("source.foo=bar");
        }).toThrow();
    });

    test("empty field name", function() {
        expect.assertions(1);

        expect(function() {
            XliffPrune.parseCriteria("=bar");
        }).toThrow();
    });

    test("empty field value", function() {
        expect.assertions(1);

        expect(function() {
            XliffPrune.parseCriteria("bar=");
        }).toThrow();
    });

    test("multiple criteria", function() {
        expect.assertions(1);

        var actual = XliffPrune.parseCriteria("source=app1.*$,datatype=^cpp$");
        var expected = {
            fields: {
                source: new RegExp("app1.*$"),
                datatype: new RegExp("^cpp$")
            },
        };
        expect(actual).toStrictEqual(expected);
    });
});

describe("xliff prune test edge cases", function() {
    test("Prune no parameters", function() {
        expect.assertions(1);

        var target = XliffPrune();
        expect(target).toBeFalsy();
    });

    test("Prune Write no parameters", function() {
        expect.assertions(1);

        var target = XliffPrune.write();
        expect(target).toBeFalsy();
    });
});

describe("xliff prune translation units in xliff v2", function() {
    test("Prune nothing", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff"
            ]
        };

        // no pruning criteria, so prunes nothing
        var target = XliffPrune(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" name="String 1a" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" name="String 1b" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" name="String 1c" type="res:string" l:datatype="x-json">\n' +
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

    test("Prune with simple field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff"
            ],
            criteria: "source=1a"
        };

        var target = XliffPrune(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_2" name="String 1b" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" name="String 1c" type="res:string" l:datatype="x-json">\n' +
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

    test("Prune with regex field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff"
            ],
            criteria: "source=^app1:.*a$"
        };

        var target = XliffPrune(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_2" name="String 1b" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" name="String 1c" type="res:string" l:datatype="x-json">\n' +
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

    test("Prune with multiple criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff"
            ],
            criteria: "source=1,targetLocale=en-US,datatype=x-json"
        };

        var target = XliffPrune(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" name="String 1a" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" name="String 1b" type="res:string" l:datatype="cpp">\n' +
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

});


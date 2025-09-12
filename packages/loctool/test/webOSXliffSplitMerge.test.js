/*
 * webOSXliffSplitMerge.test.js - test the split/Merge of webOSXliff object.
 *
  * Copyright © 2025, JEDLSoft
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


var XliffMerge = require("../lib/XliffMerge.js");
var XliffSplit = require("../lib/XliffSplit.js");

describe("webOSxliffSplitMerge", function() {
    test("webOSXliffMerge_write", function() {
        expect.assertions(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        settings.infiles = [
            "test/testfiles/xliff_webOS/app1/ko-KR.xliff",
            "test/testfiles/xliff_webOS/app1_new/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample1_f1" original="sample1">\n' +
        '    <group id="sample1_g1" name="c">\n' +
        '      <unit id="sample1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>(updated) 확인!</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Time Settings</source>\n' +
        '          <target>시간 설정</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_3">\n' +
        '        <notes>\n' +
        '          <note>new</note>\n' +
        '        </notes>\n' +
        '        <segment>\n' +
        '          <source>New String</source>\n' +
        '          <target>(new) 신규 문구</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("webOSXliffMerge_write_en_US_Style", function() {
        expect.assertions(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        settings.infiles = [
            "test/testfiles/xliff_webOS/app1/en-US.xliff",
            "test/testfiles/xliff_webOS/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
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
    test("webOSXliffMerge_write_ko_KR_Style", function() {
        expect.assertions(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        settings.infiles = [
            "test/testfiles/xliff_webOS/app1/ko-KR.xliff",
            "test/testfiles/xliff_webOS/app2/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample1_f1" original="sample1">\n' +
        '    <group id="sample1_g1" name="c">\n' +
        '      <unit id="sample1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Time Settings</source>\n' +
        '          <target>시간 설정</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="sample2_f2" original="sample2">\n' +
        '    <group id="sample2_g2" name="c">\n' +
        '      <unit id="sample2_g2_1">\n' +
        '        <segment>\n' +
        '          <source>No</source>\n' +
        '          <target>아니오</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g2_2">\n' +
        '        <segment>\n' +
        '          <source>Yes</source>\n' +
        '          <target>예</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g2_3">\n' +
        '        <mda:metadata>\n' +
        '          <mda:metaGroup category="device-type">\n' +
        '            <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '          </mda:metaGroup>\n' +
        '        </mda:metadata>\n' +
        '        <segment>\n' +
        '          <source>NOT AVAILABLE</source>\n' +
        '          <target>이용이 불가능합니다</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("webOSXliffMerge_write_sorted_by_project", function() {
        expect.assertions(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        // The order of 'infiles' is intentional (app2 before app1)
        settings.infiles = [
            "test/testfiles/xliff_webOS/app2/ko-KR.xliff",
            "test/testfiles/xliff_webOS/app1/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample1_f1" original="sample1">\n' +
        '    <group id="sample1_g1" name="c">\n' +
        '      <unit id="sample1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Time Settings</source>\n' +
        '          <target>시간 설정</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="sample2_f2" original="sample2">\n' +
        '    <group id="sample2_g2" name="c">\n' +
        '      <unit id="sample2_g2_1">\n' +
        '        <segment>\n' +
        '          <source>No</source>\n' +
        '          <target>아니오</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g2_2">\n' +
        '        <segment>\n' +
        '          <source>Yes</source>\n' +
        '          <target>예</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g2_3">\n' +
        '        <mda:metadata>\n' +
        '          <mda:metaGroup category="device-type">\n' +
        '            <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '          </mda:metaGroup>\n' +
        '        </mda:metadata>\n' +
        '        <segment>\n' +
        '          <source>NOT AVAILABLE</source>\n' +
        '          <target>이용이 불가능합니다</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("webOSXliffMerge_with_different_unit", function() {
        expect.assertions(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        settings.infiles = [
            "test/testfiles/xliff_webOS/app1/ko-KR.xliff",
            "test/testfiles/xliff_webOS/app3/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample1_f1" original="sample1">\n' +
        '    <group id="sample1_g1" name="c">\n' +
        '      <unit id="sample1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Time Settings</source>\n' +
        '          <target>시간 설정</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="sample3_f2" original="sample3">\n' +
        '    <group id="sample3_g2" name="x-qml">\n' +
        '      <unit id="sample3_g2_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample3_g2_2" name="login">\n' +
        '        <segment>\n' +
        '          <source>Device Sign In</source>\n' +
        '          <target>기기 로그인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample3_g2_3" name="login">\n' +
        '        <segment>\n' +
        '          <source>Sign In</source>\n' +
        '          <target>로그인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="sample3_g3" name="x-json">\n' +
        '      <unit id="sample3_g3_1">\n' +
        '        <notes>\n' +
        '          <note>for json</note>\n' +
        '        </notes>\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("webOSXliffSplitdistritueSerialize_xliffStyle", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "test/testfiles/xliff_webOS/merge-en-US-style.xliff",
        ];
        settings.xliffStyle = "webOS"
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        expect(result).toBeTruthy();

        var actual = result["app2"].serialize();
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
    test("webOSXliffSplitdistritueSerialize_xliffStyle2", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "test/testfiles/xliff_webOS/merge-ko-KR.xliff",
        ];

        settings.xliffStyle = "webOS"
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        expect(result).toBeTruthy();

        var actual = result["sample2"].serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample2_f1" original="sample2">\n' +
        '    <group id="sample2_g1" name="c">\n' +
        '      <unit id="sample2_g1_1">\n' +
        '        <segment>\n' +
        '          <source>No</source>\n' +
        '          <target>아니오</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Yes</source>\n' +
        '          <target>예</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample2_g1_3">\n' +
        '        <mda:metadata>\n' +
        '          <mda:metaGroup category="device-type">\n' +
        '            <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '            <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '          </mda:metaGroup>\n' +
        '        </mda:metadata>\n' +
        '        <segment>\n' +
        '          <source>NOT AVAILABLE</source>\n' +
        '          <target>이용이 불가능합니다</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });
    test("webOSXliffSplitdistritueSerialize_xliffStyle3", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "test/testfiles/xliff_webOS/merge-ko-KR.xliff",
        ];

        settings.xliffStyle = "webOS"
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        expect(result).toBeTruthy();

        var actual = result["sample1"].serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="sample1_f1" original="sample1">\n' +
        '    <group id="sample1_g1" name="c">\n' +
        '      <unit id="sample1_g1_1">\n' +
        '        <segment>\n' +
        '          <source>OK</source>\n' +
        '          <target>확인</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="sample1_g1_2">\n' +
        '        <segment>\n' +
        '          <source>Time Settings</source>\n' +
        '          <target>시간 설정</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });

    test("XliffMerge_write_en_US_webOSStyle", function() {
            expect.assertions(2);
    
            var settings = {};
            settings.xliffVersion = 2;
            settings.xliffStyle = "webOS";
            settings.infiles = [
                "test/testfiles/xliff_webOS/app1/en-US.xliff",
                "test/testfiles/xliff_webOS/app2/en-US.xliff",
            ];
            var target = XliffMerge(settings);
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
})
/*
 * testname_en.js - test the name object in Greek
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import LocaleData from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_el = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("el-GR").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_el_GR: function(test) {
        test.expect(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSimpleName_el_GR: function(test) {
        test.expect(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"

        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_el_GR: function(test) {
        test.expect(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος κατώτερος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
             suffix : "κατώτερος",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_el_GR1: function(test) {
        test.expect(2);
        const parsed = new Name("Ο κ. Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "Ο κ.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_el_GR_second: function(test) {
        test.expect(2);
        const parsed = new Name("Κυρία. Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "Κυρία.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitleWithFamilyOnlyAndAdjunct_el_GR: function(test) {
        test.expect(2);

        let name = new Name({
            prefix: "Ο κ.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix: "μουσκεύω"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Ο κ. Νικόλαος Αλεξόπουλος μουσκεύω";

        test.equal(formatted, expected);
        test.done();

    },


    testParseTitleWithFamilyOnlyAndAdjunctex_el_GR: function(test) {
        test.expect(2);
        const parsed = new Name("αντιπρόεδρος Νικόλαος Αλεξόπουλος μουσκεύω", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "αντιπρόεδρος",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix : "μουσκεύω"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseCompoundHonorific_el_GR: function(test) {
        test.expect(2);
        const parsed = new Name("Ο κ. Αλεξόπουλος", {locale: 'el-GR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Ο κ.",
            familyName: "Αλεξόπουλος"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_el_GR: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Νικόλαος Αλεξόπουλος";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_el_GR: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Νικόλαος Αλεξόπουλος";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_el_GR: function(test) {
        test.expect(2);
        let name = new Name({

            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix: "μουσκεύω"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Νικόλαος Αλεξόπουλος μουσκεύω";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_el_GR: function(test) {
        test.expect(2);
        let name = new Name({
            suffix: "μουσκεύω",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Νικόλαος Αλεξόπουλος";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatAsianNameMedium_el_GR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_el_GR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }




};

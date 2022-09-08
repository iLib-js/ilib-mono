/*
 * testname_ta_IN.js - test the name object in Tamil
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


export const testname_ta = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ta-IN").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ta_IN: function(test) {
        test.expect(2);
        const parsed = new Name("மஹிலா ஜெயவர்த்தனே", {locale: 'ta-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_ta_IN: function(test) {
        test.expect(2);
        const parsed = new Name("மஹிலா ஜெயவர்த்தனே மூத்த", {locale: 'ta-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "மூத்த",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_ta_IN: function(test) {
        test.expect(2);
        const parsed = new Name("திரு ஜெயவர்த்தனே", {locale: 'ta-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "திரு",
            familyName: "ஜெயவர்த்தனே"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_ta_IN: function(test) {
        test.expect(2);
        const parsed = new Name("திரு மற்றும் திருமதி ஜெயவர்த்தனே", {locale: 'ta-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "திரு மற்றும் திருமதி",
            familyName: "ஜெயவர்த்தனே"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_ta_IN: function(test) {
        test.expect(2);
        const parsed = new Name("திரு மஹிலா ஜெயவர்த்தனே", {locale: 'ta-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "திரு",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSurname_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "திரு மற்றும் திருமதி",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "திரு மற்றும் திருமதி ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே",
            suffix: "மிஸ்"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "வைத்தியர் மஹிலா ஜெயவர்த்தனே மிஸ்";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ta_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "வைத்தியர் மஹிலா ஜெயவர்த்தனே";

        test.equal(formatted, expected);
        test.done();
    }



};

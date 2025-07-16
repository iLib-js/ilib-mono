/*
 * testname_es.js - test the name object in Spanish
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
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_es = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("es-ES").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testESParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("Joaquin Cebolla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Joaquin",
            familyName: "Cebolla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseTripleName: function(test) {
    test.expect(2);
        const parsed = new Name("Joaquin Zaragoza Cebolla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Joaquin",
            familyName: "Zaragoza Cebolla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseAdjunctNames: function(test) {
    test.expect(2);
        const parsed = new Name("Mario de Sevilla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Mario",
            familyName: "de Sevilla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseMultiAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Mario de las Pulgas", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Mario",
            familyName: "de las Pulgas"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseHypenatedName: function(test) {
    test.expect(2);
        const parsed = new Name("Joaquin Johnson-Cebolla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Joaquin",
            familyName: "Johnson-Cebolla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseQuadrupleName: function(test) {
    test.expect(2);
        const parsed = new Name("Joaquin Michael de los Cruzes Cebolla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "de los Cruzes Cebolla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseMultiMultiFamily: function(test) {
       test.expect(2);
        const parsed = new Name("Joaquin Michael de los Cruzes de Namur", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "de los Cruzes de Namur"
        };

        test.contains(parsed, expected);
        test.done();
    },
    testESParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. Joaquin Cebolla", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            givenName: "Joaquin",
            familyName: "Cebolla"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseHonorific: function(test) {
    test.expect(2);
        const parsed = new Name("Doña Julia Maria Lopez Ortiz", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria",
            familyName: "Lopez Ortiz"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseEverything: function(test) {
    test.expect(2);
        const parsed = new Name("Doña Julia Maria Consuela de las Piñas Ortiz III", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseConjunction1: function(test) {
    test.expect(2);
        const parsed = new Name("Rodrigo y Gabriella", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Rodrigo y Gabriella"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseConjunction2: function(test) {
    test.expect(2);
        const parsed = new Name("Rodrigo y Gabriella Cortez", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Rodrigo y Gabriella",
            familyName: "Cortez"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseConjunction3: function(test) {
    test.expect(2);
        const parsed = new Name("Rodrigo y Gabriella Cortez Colón", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Rodrigo y Gabriella",
            familyName: "Cortez Colón"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseConjunction4: function(test) {
    test.expect(2);
        const parsed = new Name("Miguel, Rodrigo, y Gabriella Cortez Colón", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Miguel, Rodrigo, y Gabriella",
            familyName: "Cortez Colón"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseFamily: function(test) {
        test.expect(2);
        const parsed = new Name("Los Hernandez", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Los",
            familyName: "Hernandez"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testESParseCompoundHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Sr. y Sra. Hernandez", {locale: 'es-ES'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Sr. y Sra.",
            familyName: "Hernandez"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testESFormatSimpleNameShort: function(test) {
       test.expect(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Joaquin Cebolla";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Joaquin Michael Cebolla";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatSimpleNameLong: function(test) {
      test.expect(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Joaquin Michael Cebolla";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatSimpleNameFull: function(test) {
      test.expect(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Joaquin Michael Cebolla";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Julia de las Piñas";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Julia Maria Consuela de las Piñas";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatComplexNameLong: function(test) {
       test.expect(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Doña Julia Maria Consuela de las Piñas Ortiz";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatComplexNameFull: function(test) {
       test.expect(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-ES'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Doña Julia Maria Consuela de las Piñas Ortiz III";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatAsianNameShort: function(test) {
      test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-MX'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatAsianNameMedium: function(test) {
       test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-MX'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatAsianNameLong: function(test) {
     test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-MX'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testESFormatAsianNameFull: function(test) {
     test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-MX'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};

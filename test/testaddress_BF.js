/*
 * testaddress.js - test the address parsing and formatting routines
 *
 * Copyright © 2013-2015, 2017, 2022 JEDLSoft
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

import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

import Address from '../src/Address.js';
import AddressFmt from '../src/AddressFmt.js';

let setUpPerformed = false;


export const testaddress_BF = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("und-BF").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAddressBFNormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("03 B.P. 7021, Ouagadougou 03, Burkina Faso", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "03 B.P. 7021");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "Ouagadougou 03");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "Burkina Faso");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFNoZip: function(test) {
        test.expect(8);
        var parsedAddress = new Address("BP 621, BOBO-DIOULASSO, BURKINA FASO", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.done();
    },

    testParseAddressBFManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "01 BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFOneLine: function(test) {
        test.expect(7);
        var parsedAddress = new Address("01 BP 621, BOBO-DIOULASSO 01, BURKINA FASO", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "01 BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFSuperfluousWhitespace: function(test) {
        test.expect(7);
        var parsedAddress = new Address("01 BP 621  \n\t\n BOBO-DIOULASSO 01\t\n\n BURKINA FASO  \n  \t\t\t", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "01 BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFNoDelimiters: function(test) {
        test.expect(7);
        var parsedAddress = new Address("01 BP 621 BOBO-DIOULASSO 01 BURKINA FASO", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "01 BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFSpecialChars: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Société nationale des postes, 01 BP 6000, BOBO-DIOULASSO 01, BURKINA FASO", {locale: 'fr-BF'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Société nationale des postes, 01 BP 6000");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testParseAddressBFFromUS: function(test) {
        test.expect(7);
        var parsedAddress = new Address("01 BP 621, BOBO-DIOULASSO 01, BURKINA FASO", {locale: 'en-US'});

        // the country name is in English because this address is for a contact in a US database

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "01 BP 621");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "BOBO-DIOULASSO 01");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "BURKINA FASO");
        test.equal(parsedAddress.countryCode, "BF");
        test.done();
    },

    testFormatAddressBF: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "01 BP 621",
            locality: "BOBO-DIOULASSO 01",
            country: "BURKINA FASO",
            countryCode: "BF"
        }, {locale: 'fr-BF'});

        var expected = "01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO";
        var formatter = new AddressFmt({locale: 'fr-BF'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    },

    testFormatAddressBFFromUS: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "01 BP 621",
            country: "BURKINA FASO",
            locality: "BOBO-DIOULASSO 01",
            countryCode: "BF"
        }, {locale: 'en-US'});

        var expected = "01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO";
        var formatter = new AddressFmt({locale: 'en-US'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }

};

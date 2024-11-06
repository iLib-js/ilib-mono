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


export const testaddress_CR = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("es-CR").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAddressCRNormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Señor Carlos Torres, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCRNoZip: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, COSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Señor Carlos Torres, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.ok(!parsedAddress.postalCode);
        test.done();
    },

    testParseAddressCRManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("SEÑOR\nFEDERICO TERRAZAS ARIAS, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "SEÑOR, FEDERICO TERRAZAS ARIAS, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCROneLine: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Señor Carlos Torres, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCRSuperfluousWhitespace: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Señor Carlos Torres, Ca 15 Av 37 # 55\n\t\n Heredia,    San Rafael\t\n\n 40501\n\nCOSTA RICA  \n  \t\t\t", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Señor Carlos Torres, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCRNoDelimiters: function(test) {
        test.expect(7);
        var parsedAddress = new Address("SEÑOR Gabriel Garcia Marquez Ca 15 Av 37 # 55 Heredia San Rafael, 40501, COSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "SEÑOR Gabriel Garcia Marquez Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCRSpecialChars: function(test) {
        test.expect(7);
        var parsedAddress = new Address("SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA", {locale: 'es-CR'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testParseAddressCRFromUS: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA", {locale: 'en-US'});

        // the country name is in English because this address is for a contact in a US database

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Señor Carlos Torres, Ca 15 Av 37 # 55");
        test.equal(parsedAddress.region, "Heredia");
        test.equal(parsedAddress.locality, "San Rafael");
        test.equal(parsedAddress.postalCode, "40501");
        test.equal(parsedAddress.country, "COSTA RICA");
        test.equal(parsedAddress.countryCode, "CR");
        test.done();
    },

    testFormatAddressCR: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
            region: "Heredia",
            locality: "San Rafael",
            country: "COSTA RICA",
            postalCode: "40501",
            countryCode: "CR"
        }, {locale: 'es-CR'});

        var expected = "Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA";
        var formatter = new AddressFmt({locale: 'es-CR'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    },

    testFormatAddressCRFromUS: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
            country: "COSTA RICA",
            region: "Heredia",
            locality: "San Rafael",
            postalCode: "40501",
            countryCode: "CR"
        }, {locale: 'en-US'});

        var expected = "Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA";
        var formatter = new AddressFmt({locale: 'en-US'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }
};

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
export const testaddress_ZA = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("en-ZA").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAddressZANormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Customer Services 497 Jacob Mare Street\nPretoria 0001\nSouth Africa", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Customer Services 497 Jacob Mare Street");
        test.equal(parsedAddress.locality, "Pretoria");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "0001");
        test.equal(parsedAddress.country, "South Africa");
        test.equal(parsedAddress.countryCode, "ZA");
        test.done();
    },

    testParseAddressZANoZip: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. J. Public 1234 Church Street Colloyn\nPRETORIA\nSOUTH AFRICA", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. J. Public 1234 Church Street Colloyn");
        test.equal(parsedAddress.locality, "PRETORIA");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.country, "SOUTH AFRICA");
        test.equal(parsedAddress.countryCode, "ZA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.done();
    },

    testParseAddressZANoCountry: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Customer Services 497 Jacob Mare Street\nPretoria 0001", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Customer Services 497 Jacob Mare Street");
        test.equal(parsedAddress.locality, "Pretoria");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "0001");
        test.ok(typeof(parsedAddress.country) === "undefined");
        test.equal(parsedAddress.countryCode, "ZA");
        test.done();
    },

    testParseAddressZAManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Customer Services 497\nJacob Mare Street\nPretoria 0001\nSOUTH AFRICA\n\n\n", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Customer Services 497, Jacob Mare Street");
        test.equal(parsedAddress.locality, "Pretoria");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "0001");
        test.equal(parsedAddress.country, "SOUTH AFRICA");
        test.equal(parsedAddress.countryCode, "ZA");
        test.done();
    },

    testParseAddressZAOneLine: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Customer Services 497 ,Jacob Mare Street , Pretoria 0001 , SOUTH AFRICA", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Customer Services 497, Jacob Mare Street");
        test.equal(parsedAddress.locality, "Pretoria");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "0001");
        test.equal(parsedAddress.country, "SOUTH AFRICA");
        test.equal(parsedAddress.countryCode, "ZA");
        test.done();
    },


    testParseAddressZANoDelimiters: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Customer Services 497 Jacob Mare Street Pretoria 0001 SOUTH AFRICA", {locale: 'en-ZA'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Customer Services 497 Jacob Mare Street");
        test.equal(parsedAddress.locality, "Pretoria");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "0001");
        test.equal(parsedAddress.country, "SOUTH AFRICA");
        test.equal(parsedAddress.countryCode, "ZA");
        test.done();
    },

    testFormatAddressZAZA: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Customer Services 497 Jacob Mare Street",
            locality: "Pretoria",
            region: null,
            postalCode: "0001",
            country: "SOUTH AFRICA",
            countryCode: "ZA"
        }, {locale: 'en-ZA'});

        var expected = "Customer Services 497 Jacob Mare Street\nPretoria 0001\nSOUTH AFRICA";
        var formatter = new AddressFmt({locale: 'en-ZA'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }


};

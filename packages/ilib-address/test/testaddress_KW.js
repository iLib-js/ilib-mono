/*
 * testaddress_KW.js - test the address parsing and formatting routines
 *
 * Copyright © 2013-2015, 2017, 2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
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
export const testaddress_KW = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ar-KW").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAddressKWNormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("حمد عبد الله حسن\n آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\n\nالكويت\n\n\n", {locale: 'ar-KW'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن, آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الكويت");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "١٥٥٤٥");
        test.equal(parsedAddress.country, "الكويت");
        test.equal(parsedAddress.countryCode, "KW");
        test.done();
    },

    testParseAddressKWNoZip: function(test) {
        test.expect(7);
        var parsedAddress = new Address("حمد عبد الله حسن آل الصباح ١٠٠٨٤\nالكويت\nالكويت", {locale: 'ar-KW'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الكويت");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.country, "الكويت");
        test.equal(parsedAddress.countryCode, "KW");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.done();
    },

    testParseAddressKWNoCountry: function(test) {
        test.expect(7);
        var parsedAddress = new Address("حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الجهرا", {locale: 'ar-KW'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الجهرا");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "١٥٥٤٥");
        test.ok(typeof(parsedAddress.country) === "undefined");
        test.equal(parsedAddress.countryCode, "KW");
        test.done();
    },

    testParseAddressKWManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("حمد عبد الله حسن\n آل الصباح ١٠٠٨٤\n١٥٥٤٥\nالكويت\n\nالكويت\n\n\n", {locale: 'ar-KW'});
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن, آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الكويت");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "١٥٥٤٥");
        test.equal(parsedAddress.country, "الكويت");
        test.equal(parsedAddress.countryCode, "KW");
        test.done();
    },


    testParseAddressKWSuperfluousWhitespace: function(test) {
        test.expect(7);
        var parsedAddress = new Address("\t\t\tحمد عبد الله حسن\n\n\t آل الصباح ١٠٠٨٤\n\n\t١٥٥٤٥\n\n\tالكويت\n\n\tالكويت\n\n\n", {locale: 'ar-KW'});

        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن, آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الكويت");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "١٥٥٤٥");
        test.equal(parsedAddress.country, "الكويت");
        test.equal(parsedAddress.countryCode, "KW");
        test.done();
    },


    testParseAddressKWFromUS: function(test) {
        test.expect(7);
        var parsedAddress = new Address("حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥\nالكويت\nKuwait", {locale: 'en-US'});



        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "حمد عبد الله حسن آل الصباح ١٠٠٨٤");
        test.equal(parsedAddress.locality, "الكويت");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.postalCode, "١٥٥٤٥");
        test.equal(parsedAddress.country, "Kuwait");
        test.equal(parsedAddress.countryCode, "KW");
        test.done();
    },

    testFormatAddressKW: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
            locality: "الكويت",
            postalCode: "١٥٥٤٥",
            country: "الكويت",
            countryCode: "KW"
        }, {locale: 'ar-KW'});

        var expected = "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\nالكويت";
        var formatter = new AddressFmt({locale: 'ar-KW'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    },

    testFormatAddressKWFromUS: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
            locality: "الكويت",
            postalCode: "١٥٥٤٥",
            country: "Kuwait",
            countryCode: "KW"
        }, {locale: 'en-US'});

        var expected = "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\nKuwait";
        var formatter = new AddressFmt({locale: 'en-US'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }

};

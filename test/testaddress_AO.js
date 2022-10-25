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


export const testaddress_AO = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("und-AO").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAOAddressNormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressNoZip: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.done();
    },
    
    testParseAOAddressManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele\nRua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressOneLine: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressSuperfluousWhitespace: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o  \n\t\n LUANDA\t\n\n ANGOLA  \n  \t\t\t", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressNoDelimiters: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele P. 15 Sh. 1 LUANDA ANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele P. 15 Sh. 1");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressSpeciAOChars: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA", {locale: 'pt-AO'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testParseAOAddressFromUS: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA", {locale: 'en-US'});
        
        // the country name is in English because this address is for a contact in a US database
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o");
        test.ok(typeof(parsedAddress.region) === "undefined");
        test.equal(parsedAddress.locality, "LUANDA");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.equal(parsedAddress.country, "ANGOLA");
        test.equal(parsedAddress.countryCode, "AO");
        test.done();
    },
    
    testFormatAddressAO: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
            locality: "LUANDA",
            country: "ANGOLA",
            countryCode: "AO"
        }, {locale: 'pt-AO'});
        
        var expected = "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA";
        var formatter = new AddressFmt({locale: 'pt-AO'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    },
    
    testFormatAddressAOFromUS: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
            locality: "LUANDA",
            country: "ANGOLA",
            countryCode: "AO"
        }, {locale: 'en-US'});
        
        var expected = "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA";
        var formatter = new AddressFmt({locale: 'en-US'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }
    
};

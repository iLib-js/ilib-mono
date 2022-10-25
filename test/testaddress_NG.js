/*
 * testaddress_NG.js - test the address parsing and formatting routines
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
export const testaddress_NG = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("und-AE").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseAddressNGNormal: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. Ben Tal 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGNoZip: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS PLATEAU\nNIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. Ben Tal 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.ok(typeof(parsedAddress.postalCode) === "undefined");
        test.done();
    },
    
    testParseAddressNGNoCountry: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. Ben Tal 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");    
        test.ok(typeof(parsedAddress.country) === "undefined");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGManyLines: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal\n1234 Bauchu Road\nYelwa\nJOS 930283\nPLATEAU\nNIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
          test.equal(parsedAddress.streetAddress, "Mr. Ben Tal, 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGOneLine: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal , 1234 Bauchu Road , Yelwa , JOS , 930283 , PLATEAU , NIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
          test.equal(parsedAddress.streetAddress, "Mr. Ben Tal, 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGSuperfluousWhitespace: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal\n\n\t1234 Bauchu RoadS\n\n\nYelwa\n\t\nJOS\t\t\r930283\r\r\n\rPLATEAU\t\t\rNIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
          test.equal(parsedAddress.streetAddress, "Mr. Ben Tal, 1234 Bauchu RoadS, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGNoDelimiters: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal 1234 Bauchu Road, Yelwa JOS 930283\nPLATEAU NIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. Ben Tal 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testParseAddressNGFromUS: function(test) {
        test.expect(7);
        var parsedAddress = new Address("Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA", {locale: 'en-NG'});
        
        test.ok(typeof(parsedAddress) !== "undefined");
        test.equal(parsedAddress.streetAddress, "Mr. Ben Tal 1234 Bauchu Road, Yelwa");
        test.equal(parsedAddress.locality, "JOS");
        test.equal(parsedAddress.region, "PLATEAU");
        test.equal(parsedAddress.postalCode, "930283");
        test.equal(parsedAddress.country, "NIGERIA");
        test.equal(parsedAddress.countryCode, "NG");
        test.done();
    },
    
    testFormatAddressNG: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
            locality: "JOS",
            postalCode: "930283",
            region: "PLATEAU",
            country: "NIGERIA",
            countryCode: "NG"
        }, {locale: 'en-NG'});
        
        var expected = "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA";
        var formatter = new AddressFmt({locale: 'en-NG'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    },
    
    testFormatAddressNGFromUS: function(test) {
        test.expect(1);
        var parsedAddress = new Address({
            streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
            locality: "JOS",
            postalCode: "930283",
            region: "PLATEAU",
            country: "NIGERIA",
            countryCode: "NG"
        }, {locale: 'en-US'});
        
        var expected = "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA";
        var formatter = new AddressFmt({locale: 'en-US'});
        test.equal(formatter.format(parsedAddress), expected);
        test.done();
    }
    
};

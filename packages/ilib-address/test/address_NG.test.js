/*
 * address_NG.test.js - Nigeria address parsing and formatting tests for ilib-address
 *
 * Copyright © 2013-2015, 2017, 2022, 2025 JEDLSoft
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

describe('address_NG', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-NG");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Nigeria address with all components',
                address: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address without postal code',
                address: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS PLATEAU\nNIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: undefined,
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address without country',
                address: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: undefined,
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address with multiple lines',
                address: "Mr. Ben Tal\n1234 Bauchu Road\nYelwa\nJOS 930283\nPLATEAU\nNIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal, 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address in single line format',
                address: "Mr. Ben Tal , 1234 Bauchu Road , Yelwa , JOS , 930283 , PLATEAU , NIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal, 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address with superfluous whitespace',
                address: "Mr. Ben Tal\n\n\t1234 Bauchu RoadS\n\n\nYelwa\n\t\nJOS\t\t\r930283\r\r\n\rPLATEAU\t\t\rNIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal, 1234 Bauchu RoadS, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address without delimiters',
                address: "Mr. Ben Tal 1234 Bauchu Road, Yelwa JOS 930283\nPLATEAU NIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            },
            {
                name: 'should parse Nigeria address from US locale',
                address: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA",
                locale: 'en-NG',
                expected: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    region: "PLATEAU",
                    postalCode: "930283",
                    country: "NIGERIA",
                    countryCode: "NG"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format Nigeria address in Nigerian locale',
                address: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    postalCode: "930283",
                    region: "PLATEAU",
                    country: "NIGERIA",
                    countryCode: "NG"
                },
                locale: 'en-NG',
                expected: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA"
            },
            {
                name: 'should format Nigeria address in US locale',
                address: {
                    streetAddress: "Mr. Ben Tal 1234 Bauchu Road, Yelwa",
                    locality: "JOS",
                    postalCode: "930283",
                    region: "PLATEAU",
                    country: "NIGERIA",
                    countryCode: "NG"
                },
                locale: 'en-US',
                expected: "Mr. Ben Tal 1234 Bauchu Road, Yelwa\nJOS 930283\nPLATEAU\nNIGERIA"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
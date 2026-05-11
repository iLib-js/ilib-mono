/*
 * address_GH.test.js - test the address parsing and formatting routines for Ghana
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("en-GH");
    }
});

describe('Address parsing for Ghana', () => {
    const testCases = [
        {
            name: 'should parse normal Ghanaian address',
            input: "Mr. John Mensah P.O. Box 1234\nACCRA\nGHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address without zip code',
            input: "Mr. John Mensah P.O. Box 1234\nACCRA\nGHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address without country',
            input: "Mr. John Mensah P.O. Box 1234\nACCRA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address with multiple lines',
            input: "Mr. John Mensah\nP.O. Box 1234\nACCRA\nGHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah, P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address in one line',
            input: "Mr. John Mensah , P.O. Box 1234 , ACCRA , GHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah, P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address with superfluous whitespace',
            input: "Mr. John Mensah\n\n\t\r\t\t\rP.O. Box 1234\r\r\n\nACCRA\t\r\n\t\rGHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah, P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address without delimiters',
            input: "Mr. John Mensah P.O. Box 1234 ACCRA GHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        },
        {
            name: 'should parse Ghanaian address from US locale',
            input: "Mr. John Mensah P.O. Box 1234\nACCRA\nGHANA",
            locale: 'en-GH',
            expected: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                region: undefined,
                postalCode: undefined,
                country: "GHANA",
                countryCode: "GH"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Ghana', () => {
    const testCases = [
        {
            name: 'should format Ghanaian address with Ghana locale',
            address: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                postalCode: "1010",
                country: "GHANA",
                countryCode: "GH"
            },
            locale: 'en-GH',
            expected: "Mr. John Mensah P.O. Box 1234\nACCRA\nGHANA"
        },
        {
            name: 'should format Ghanaian address with US locale',
            address: {
                streetAddress: "Mr. John Mensah P.O. Box 1234",
                locality: "ACCRA",
                postalCode: "1010",
                country: "GHANA",
                countryCode: "GH"
            },
            locale: 'en-US',
            expected: "Mr. John Mensah P.O. Box 1234\nACCRA\nGHANA"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
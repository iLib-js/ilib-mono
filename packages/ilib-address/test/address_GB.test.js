/*
 * address_GB.test.js - test the address parsing and formatting routines for United Kingdom
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
 * See the License for the Specific language governing permissions and
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
        await LocaleData.ensureLocale("en-GB");
    }
});

describe('Address parsing for United Kingdom', () => {
    const testCases = [
        {
            name: 'should parse normal UK address',
            input: "Belgrave House\n76 Buckingham Palace Road\nLondon SW1W 9TQ\nUnited Kingdom",
            locale: 'en-GB',
            expected: {
                streetAddress: "Belgrave House, 76 Buckingham Palace Road",
                locality: "London",
                region: undefined,
                postalCode: "SW1W 9TQ",
                country: "United Kingdom",
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address without zip code',
            input: "Peter House\nOxford Street\nManchester",
            locale: 'en-GB',
            expected: {
                streetAddress: "Peter House, Oxford Street",
                locality: "Manchester",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address without country',
            input: "88 Wood Street\nLondon\nEC2V 7QT",
            locale: 'en-GB',
            expected: {
                streetAddress: "88 Wood Street",
                locality: "London",
                region: undefined,
                postalCode: "EC2V 7QT",
                country: undefined,
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address with multiple lines',
            input: "2 Kelvin Close\nBirchwood Science Park North\nNorth Risley\nWarrington\nCheshire\nWA3 7PB\nUK",
            locale: 'en-GB',
            expected: {
                streetAddress: "2 Kelvin Close, Birchwood Science Park North, North Risley, Warrington",
                locality: "Cheshire",
                region: undefined,
                postalCode: "WA3 7PB",
                country: "UK",
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address in one line',
            input: "Amen Corner, Cain Road, Bracknell, Berkshire, RG12 1HN, England",
            locale: 'en-GB',
            expected: {
                streetAddress: "Amen Corner, Cain Road, Bracknell",
                locality: "Berkshire",
                region: undefined,
                postalCode: "RG12 1HN",
                country: "England",
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address with superfluous whitespace',
            input: "\t\t\tAmen Corner\n\t\t\tCain Road, \t\t\t\r\r Bracknell, \n \r \tBerkshire, \n\t\nRG12 1HN\t\n\t England\n\n\n",
            locale: 'en-GB',
            expected: {
                streetAddress: "Amen Corner, Cain Road, Bracknell",
                locality: "Berkshire",
                region: undefined,
                postalCode: "RG12 1HN",
                country: "England",
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address without delimiters',
            input: "Amen Corner Cain Road Bracknell Berkshire RG12 1HN England",
            locale: 'en-GB',
            expected: {
                streetAddress: "Amen Corner Cain Road Bracknell",
                locality: "Berkshire",
                region: undefined,
                postalCode: "RG12 1HN",
                country: "England",
                countryCode: "GB"
            }
        },
        {
            name: 'should parse UK address from German locale',
            input: "Belgrave House\n76 Buckingham Palace Road\nLondon SW1W 9TQ\nVereinigtes Königreich",
            locale: 'de-DE',
            expected: {
                streetAddress: "Belgrave House, 76 Buckingham Palace Road",
                locality: "London",
                region: undefined,
                postalCode: "SW1W 9TQ",
                country: "Vereinigtes Königreich",
                countryCode: "GB"
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

describe('Address formatting for United Kingdom', () => {
    const testCases = [
        {
            name: 'should format UK address with British locale',
            address: {
                streetAddress: "Belgrave House, 76 Buckingham Palace Road",
                locality: "London",
                postalCode: "SW1W 9TQ",
                country: "Old Blighty",
                countryCode: "GB"
            },
            locale: 'en-GB',
            expected: "Belgrave House, 76 Buckingham Palace Road\nLondon\nSW1W 9TQ\nOld Blighty"
        },
        {
            name: 'should format UK address with German locale',
            address: {
                streetAddress: "Belgrave House, 76 Buckingham Palace Road",
                locality: "London",
                postalCode: "SW1W 9TQ",
                country: "Old Blighty",
                countryCode: "GB"
            },
            locale: 'de-DE',
            expected: "Belgrave House, 76 Buckingham Palace Road\nLondon\nSW1W 9TQ\nOld Blighty"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
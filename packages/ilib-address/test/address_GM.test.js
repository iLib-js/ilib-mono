/*
 * address_GM.test.js - test the address parsing and formatting routines for Gambia
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
        await LocaleData.ensureLocale("en-GM");
    }
});

describe('Address parsing for Gambia', () => {
    const testCases = [
        {
            name: 'should parse normal Gambian address',
            input: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL\nGAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address without zip code',
            input: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL\nGAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address without country',
            input: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address with multiple lines',
            input: "Mr. A. Ceesay\n21 Liberation Avenue\nBANJUL\nGAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay, 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address in one line',
            input: "Mr. A. Ceesay , 21 Liberation Avenue , BANJUL , GAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay, 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address with superfluous whitespace',
            input: "Mr. A. Ceesay\n\n\t\r\t\t\r21 Liberation Avenue\r\r\n\nBANJUL\t\r\n\t\rGAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay, 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
            }
        },
        {
            name: 'should parse Gambian address from US locale',
            input: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL\nGAMBIA",
            locale: 'en-GM',
            expected: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                region: undefined,
                postalCode: undefined,
                country: "GAMBIA",
                countryCode: "GM"
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

describe('Address formatting for Gambia', () => {
    const testCases = [
        {
            name: 'should format Gambian address with Gambia locale',
            address: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                postalCode: "1010",
                country: "GAMBIA",
                countryCode: "GM"
            },
            locale: 'en-GM',
            expected: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL\nGAMBIA"
        },
        {
            name: 'should format Gambian address with US locale',
            address: {
                streetAddress: "Mr. A. Ceesay 21 Liberation Avenue",
                locality: "BANJUL",
                postalCode: "1010",
                country: "GAMBIA",
                countryCode: "GM"
            },
            locale: 'en-US',
            expected: "Mr. A. Ceesay 21 Liberation Avenue\nBANJUL\nGAMBIA"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
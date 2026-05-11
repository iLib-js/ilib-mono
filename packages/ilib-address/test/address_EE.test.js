/*
 * address_EE.test.js - test the address parsing and formatting routines for Estonia
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
        await LocaleData.ensureLocale("et-EE");
    }
});

describe('Address parsing for Estonia', () => {
    const testCases = [
        {
            name: 'should parse normal Estonian address',
            input: "The Stenbock House, Rahukohtu 3, 15161 Tallinn, Estonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address without zip code',
            input: "The Stenbock House, Rahukohtu 3,Tallinn, Estonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: undefined,
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address with multiple lines',
            input: "The Stenbock House\nRahukohtu 3\n15161 Tallinn\nEstonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address in one line',
            input: "The Stenbock House, Rahukohtu 3, 15161 Tallinn, Estonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address with superfluous whitespace',
            input: "The Stenbock House\n\tRahukohtu 3  \n\t\n 15161 Tallinn\t\n\n Estonia  \n  \t\t\t",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address without delimiters',
            input: "The Stenbock House Rahukohtu 3 15161 Tallinn Estonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "The Stenbock House Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address with special characters',
            input: "Informatics Center, Rävala 5, 15169 Tallinn, Estonia",
            locale: 'et-EE',
            expected: {
                streetAddress: "Informatics Center, Rävala 5",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15169",
                country: "Estonia",
                countryCode: "EE"
            }
        },
        {
            name: 'should parse Estonian address from US locale',
            input: "The Stenbock House, Rahukohtu 3, 15161 Tallinn, Estonia",
            locale: 'en-US',
            expected: {
                streetAddress: "The Stenbock House, Rahukohtu 3",
                region: undefined,
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Estonia', () => {
    const testCases = [
        {
            name: 'should format Estonian address with Estonian locale',
            address: {
                streetAddress: "The Stenbock House\nRahukohtu 3",
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            },
            locale: 'et-EE',
            expected: "The Stenbock House\nRahukohtu 3\n15161 Tallinn\nEstonia"
        },
        {
            name: 'should format Estonian address with US locale',
            address: {
                streetAddress: "The Stenbock House\nRahukohtu 3",
                locality: "Tallinn",
                postalCode: "15161",
                country: "Estonia",
                countryCode: "EE"
            },
            locale: 'en-US',
            expected: "The Stenbock House\nRahukohtu 3\n15161 Tallinn\nEstonia"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
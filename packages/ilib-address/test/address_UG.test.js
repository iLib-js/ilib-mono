/*
 * address_UG.test.js - test the address parsing and formatting routines for Uganda
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
        await LocaleData.ensureLocale("en-UG");
    }
});

describe('Address parsing for Uganda', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, PO box, city and country',
            address: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA\nUganda',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA\nUganda',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Ms. Olive Takubua\nP.O. Box 21310\nKAMPALA\nUganda\n\n\n',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua, P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Ms. Olive Takubua , P.O. Box 21310 , KAMPALA , Uganda',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua, P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\t\tMs. Olive Takubua\t\t\tP.O. Box\t\r\r21310\t\nKAMPALA\n\t Uganda\n\n\n',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Ms. Olive Takubua P.O. Box 21310 KAMPALA Uganda',
            locale: 'en-UG',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA\nUganda',
            locale: 'en-US',
            expected: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBeUndefined();
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Uganda', () => {
    const testCases = [
        {
            name: 'should format address for Uganda locale',
            addressData: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            },
            locale: 'en-UG',
            expected: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA\nUganda'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Ms. Olive Takubua P.O. Box 21310',
                locality: 'KAMPALA',
                country: 'Uganda',
                countryCode: 'UG'
            },
            locale: 'en-US',
            expected: 'Ms. Olive Takubua P.O. Box 21310\nKAMPALA\nUganda'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
/*
 * address_ZM.test.js - test the address parsing and formatting routines for Zambia
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
        await LocaleData.ensureLocale("en-ZM");
    }
});

describe('Address parsing for Zambia', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, postal code, city and country',
            address: 'Mr. Richard Chanda 10 Nyimba Road\n50100 NDOLA\nZAMBIA',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '50100',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Mr. Richard Chanda 10 Nyimba Road\nNDOLA\nZAMBIA',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Mr. Richard Chanda 10 Nyimba Road\n50100 NDOLA',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '50100',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Mr. Richard Chanda\n10\nNyimba\nRoad\n50100\nNDOLA\nZAMBIA\n\n\n',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda, 10, Nyimba, Road',
                locality: 'NDOLA',
                postalCode: '50100',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Mr. Richard Chanda , 10 , Nyimba , Road , 50100 , NDOLA , ZAMBIA',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda, 10, Nyimba, Road',
                locality: 'NDOLA',
                postalCode: '50100',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tMr. Richard Chanda\n\t\t\t10 \t\t\t\r\r Nyimba \n \r \tRoad \n\t\n50100\t\nNDOLA\n\t ZAMBIA\n\n\n',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda, 10 Nyimba, Road',
                locality: 'NDOLA',
                postalCode: '50100',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Mr. Richard Chanda 10 Nyimba Road 50100 NDOLA ZAMBIA',
            locale: 'en-ZM',
            expected: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '50100',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Mr. Richard Chanda 10 Nyimba Road\n56001 NDOLA\nZAMBIA',
            locale: 'en-US',
            expected: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '56001',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        if (expected.postalCode) {
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
        } else {
            expect(parsedAddress.postalCode).toBeUndefined();
        }
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Zambia', () => {
    const testCases = [
        {
            name: 'should format address for Zambia locale',
            addressData: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '56001',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            },
            locale: 'en-ZM',
            expected: 'Mr. Richard Chanda 10 Nyimba Road\n56001 NDOLA\nZAMBIA'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Mr. Richard Chanda 10 Nyimba Road',
                locality: 'NDOLA',
                postalCode: '56001',
                country: 'ZAMBIA',
                countryCode: 'ZM'
            },
            locale: 'en-US',
            expected: 'Mr. Richard Chanda 10 Nyimba Road\n56001 NDOLA\nZAMBIA'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
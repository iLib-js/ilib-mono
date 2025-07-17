/*
 * address_BG.test.js - test the address parsing and formatting routines for Bulgaria
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
        await LocaleData.ensureLocale("bg-BG");
    }
});

describe('Address parsing for Bulgaria', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, floor, postal code and city',
            address: 'Georg Popandov, Kukush Str. 2, fl.6, 1309 SOFIA, BULGARIA',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse address with postal code',
            address: 'Georg Popandov, Kukush Str. 2, fl.6, 1309 SOFIA, BULGARIA',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Georg Popandov\nKukush Str. 2, fl.6\n1309 SOFIA\nBULGARIA',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Georg Popandov, Kukush Str. 2, fl.6, 1309 SOFIA, BULGARIA',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: 'Georg Popandov, Kukush Str. 2, fl.6  \n\t\n 1309 SOFIA\t\n\n BULGARIA  \n  \t\t\t',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Georg Popandov Kukush Str. 2 fl.6 1309 SOFIA BULGARIA',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Georg Popandov Kukush Str. 2 fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse address with Bulgarian special characters',
            address: 'Джордж Попандов, Ул. Кукуш. 2, ет.6, 1309 СОФИЯ, БЪЛГАРИЯ',
            locale: 'bg-BG',
            expected: {
                streetAddress: 'Джордж Попандов, Ул. Кукуш. 2, ет.6',
                locality: 'СОФИЯ',
                postalCode: '1309',
                country: 'БЪЛГАРИЯ',
                countryCode: 'BG'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Georg Popandov, Kukush Str. 2, fl.6, 1309 SOFIA, BULGARIA',
            locale: 'en-US',
            expected: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: 'SOFIA',
                postalCode: '1309',
                country: 'BULGARIA',
                countryCode: 'BG'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Bulgaria', () => {
    const testCases = [
        {
            name: 'should format address for Bulgarian locale',
            addressData: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                locality: '1309 SOFIA',
                country: 'BULGARIA',
                countryCode: 'BG'
            },
            locale: 'bg-BG',
            expected: 'Georg Popandov, Kukush Str. 2, fl.6\n1309 SOFIA\nBULGARIA'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Georg Popandov, Kukush Str. 2, fl.6',
                country: 'BULGARIA',
                locality: '1309 SOFIA',
                countryCode: 'BG'
            },
            locale: 'en-US',
            expected: 'Georg Popandov, Kukush Str. 2, fl.6\n1309 SOFIA\nBULGARIA'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
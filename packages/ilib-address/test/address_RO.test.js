/*
 * address_RO.test.js - test the address parsing and formatting routines for Romania
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
        await LocaleData.ensureLocale("ro-RO");
    }
});

describe('Address parsing for Romania', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, apartment, postal code, city and country',
            address: 'Călina Enescu Stradă Măguricea 1, ap. 1\n014231 BUCUREŞTI\nRomania',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Călina Enescu Stradă Măguricea 1, ap. 1\nBUCUREŞTI\nRomania',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Călina Enescu Stradă Măguricea 1, ap. 1\n014231 BUCUREŞTI',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Călina Enescu Stradă\nMăguricea 1\nap. 1\n\n014231\nBUCUREŞTI\n\nRomania\n\n\n',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă, Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Călina Enescu Stradă , Măguricea 1 , ap. 1 , 014231 , BUCUREŞTI , Romania',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă, Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tCălina Enescu Stradă\t\t\rMăguricea 1\t\t\rap. 1\n\n014231\t\n\nBUCUREŞTI\n\t\nRomania\n\n\n',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1 ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Călina Enescu Stradă Măguricea 1, ap. 1 014231 BUCUREŞTI Romania',
            locale: 'ro-RO',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Călina Enescu Stradă Măguricea 1, ap. 1\n014231 BUCUREŞTI\nRomania',
            locale: 'en-US',
            expected: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
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

describe('Address formatting for Romania', () => {
    const testCases = [
        {
            name: 'should format address for Romanian locale',
            addressData: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            },
            locale: 'ro-RO',
            expected: 'Călina Enescu Stradă Măguricea 1, ap. 1\n014231 BUCUREŞTI\nRomania'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Călina Enescu Stradă Măguricea 1, ap. 1',
                locality: 'BUCUREŞTI',
                postalCode: '014231',
                country: 'Romania',
                countryCode: 'RO'
            },
            locale: 'en-US',
            expected: 'Călina Enescu Stradă Măguricea 1, ap. 1\n014231 BUCUREŞTI\nRomania'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
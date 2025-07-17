/*
 * address_BJ.test.js - test the address parsing and formatting routines for Benin
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
        await LocaleData.ensureLocale("fr-BJ");
    }
});

describe('Address parsing for Benin', () => {
    const testCases = [
        {
            name: 'should parse normal address with BP format and postal code',
            address: '03 BP 1000, COTONOU, BENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'BP 1000, COTONOU, BENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse multi-line address',
            address: '03 BP 1000\nCOTONOU\nBENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: '03 BP 1000, COTONOU, BENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '03 BP 1000  \n\t\n COTONOU\t\n\n BENIN  \n  \t\t\t',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: '03 BP 1000 COTONOU BENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse address with special characters',
            address: '03 BP 1000, COTONOU, BENIN',
            locale: 'fr-BJ',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            }
        },
        {
            name: 'should parse address from US locale',
            address: '03 BP 1000, COTONOU, BENIN',
            locale: 'en-US',
            expected: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
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
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Benin', () => {
    const testCases = [
        {
            name: 'should format address for French locale',
            addressData: {
                streetAddress: 'BP 1000',
                locality: 'COTONOU',
                postalCode: '03',
                country: 'BENIN',
                countryCode: 'BJ'
            },
            locale: 'fr-BJ',
            expected: '03 BP 1000\nCOTONOU\nBENIN'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'BP 1000',
                postalCode: '03',
                country: 'BENIN',
                locality: 'COTONOU',
                countryCode: 'BJ'
            },
            locale: 'en-US',
            expected: '03 BP 1000\nCOTONOU\nBENIN'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
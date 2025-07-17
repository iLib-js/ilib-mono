/*
 * address_RW.test.js - test the address parsing and formatting routines for Rwanda
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
        await LocaleData.ensureLocale("fr-RW");
    }
});

describe('Address parsing for Rwanda', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, PO box, city and country',
            address: 'M. Pierre Simon B.P. 3425\nKIGALI\nRwanda',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'M. Pierre Simon B.P. 3425\nKIGALI\nRwanda',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse address without country',
            address: 'M. Pierre Simon B.P. 3425\nKIGALI',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'M. Pierre Simon\nB.P. 3425\nKIGALI\nRwanda\n\n\n',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon, B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'M. Pierre Simon , B.P. 3425 , KIGALI , Rwanda',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon, B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\t\tM. Pierre Simon\t\t\tB.P. 3425\n\t\nKIGALI\n\tRwanda\n\n\n',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'M. Pierre Simon B.P. 3425 KIGALI Rwanda',
            locale: 'fr-RW',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'M. Pierre Simon B.P. 3425\nKIGALI\nRwanda',
            locale: 'en-US',
            expected: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
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

describe('Address formatting for Rwanda', () => {
    const testCases = [
        {
            name: 'should format address for French locale',
            addressData: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            },
            locale: 'fr-RW',
            expected: 'M. Pierre Simon B.P. 3425\nKIGALI\nRwanda'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'M. Pierre Simon B.P. 3425',
                locality: 'KIGALI',
                country: 'Rwanda',
                countryCode: 'RW'
            },
            locale: 'en-US',
            expected: 'M. Pierre Simon B.P. 3425\nKIGALI\nRwanda'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
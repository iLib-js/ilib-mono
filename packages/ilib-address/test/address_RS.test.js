/*
 * address_RS.test.js - test the address parsing and formatting routines for Serbia
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
        await LocaleData.ensureLocale("sr-Latn-RS");
    }
});

describe('Address parsing for Serbia', () => {
    const testCases = [
        {
            name: 'should parse normal address with street, number, district, postal code, city, region and country',
            address: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum\n11070 Belgradum\nCentral-Serbia\nSerbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum\nBelgradum\nCentral-Serbia\nSerbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum\n11070 Belgradum\nCentral-Serbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Boulevard arsenicum Carnojevica\n56 Novi Belgradum\n11070 Belgradum\nCentral-Serbia\nSerbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica, 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Boulevard arsenicum Carnojevica , 56 Novi Belgradum , 11070 , Belgradum , Central-Serbia , Serbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica, 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse address with superfluous whitespace and Cyrillic characters',
            address: 'Boulevard arsenicum Чарнојевић\n\n\t56 Novi Belgradum\n\n\r11070\r\r\nBelgradum\t\t\rCentral-Serbia\t\t\rSerbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Чарнојевић, 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum 11070 Belgradum Central-Serbia Serbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Bulevar Arsenija Carnojevica 56 New Belgrade\n11070 Belgrade\nCentral-Serbia\nSerbia',
            locale: 'sr-Latn-RS',
            expected: {
                streetAddress: 'Bulevar Arsenija Carnojevica 56 New Belgrade',
                locality: 'Belgrade',
                region: 'Central-Serbia',
                postalCode: '11070',
                country: 'Serbia',
                countryCode: 'RS'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
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

describe('Address formatting for Serbia', () => {
    const testCases = [
        {
            name: 'should format address for Serbian Latin locale',
            addressData: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                postalCode: '11070',
                region: 'Central-Serbia',
                country: 'Serbia',
                countryCode: 'RS'
            },
            locale: 'sr-Latn-RS',
            expected: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum\n11070 Belgradum\nCentral-Serbia\nSerbia'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum',
                locality: 'Belgradum',
                postalCode: '11070',
                region: 'Central-Serbia',
                country: 'Serbia',
                countryCode: 'RS'
            },
            locale: 'en-US',
            expected: 'Boulevard arsenicum Carnojevica 56 Novi Belgradum\n11070 Belgradum\nCentral-Serbia\nSerbia'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
/*
 * address_AF.test.js - test the address parsing and formatting routines for Afghanistan
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
        await LocaleData.ensureLocale("fa-AF");
    }
});

describe('Address parsing for Afghanistan', () => {
    const testCases = [
        {
            name: 'should parse normal address with Persian name, street, region, postal code and country',
            address: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲, کابل, ۱۰۰۱, افغانستان',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲, کابل, افغانستان',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'آقای احمد توحید\nخیابان، خانه شماره ۰۴۲\nکابل ۱۰۰۱\nافغانستان',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲,کابل ۱۰۰۱ افغانستان',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲   \n\t\n کابل ۱۰۰۱\t\n\n افغانستان  \n  \t\t\t',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'آقای احمد توحید خیابان، خانه شماره ۰۴۲ کابل ۱۰۰۱ افغانستان',
            locale: 'fa-AF',
            expected: {
                streetAddress: 'آقای احمد توحید خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲,کابل ۱۰۰۱,Afghanistan',
            locale: 'en-US',
            expected: {
                streetAddress: 'آقای احمد توحید, خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'Afghanistan',
                countryCode: 'AF'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBeUndefined();
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

describe('Address formatting for Afghanistan', () => {
    const testCases = [
        {
            name: 'should format address for Persian locale',
            addressData: {
                streetAddress: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲',
                region: 'کابل',
                postalCode: '۱۰۰۱',
                country: 'افغانستان',
                countryCode: 'AF'
            },
            locale: 'fa-AF',
            expected: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲\nکابل\n۱۰۰۱\nافغانستان'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲',
                postalCode: '۱۰۰۱',
                country: 'Afghanistan',
                countryCode: 'AF'
            },
            locale: 'en-US',
            expected: 'آقای احمد توحید,خیابان، خانه شماره ۰۴۲\n۱۰۰۱\nAfghanistan'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
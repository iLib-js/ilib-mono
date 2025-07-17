/*
 * address_BH.test.js - test the address parsing and formatting routines for Bahrain
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
        await LocaleData.ensureLocale("ar-BH");
    }
});

describe('Address parsing for Bahrain', () => {
    const testCases = [
        {
            name: 'should parse normal address with Arabic text, building number, city and postal code',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢, المنامة ٣١٦, البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢, المنامة, البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'السيد عبد الله احمد\nعمارة ٢٢٢\nالمنامة ٣١٦\n البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢,المنامة ٣١٦, البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢  \n\t\n المنامة ٣١٦\t\n\n البحرين \n \t\t\t',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'السيد عبد الله احمد عمارة ٢٢٢ المنامة ٣١٦  البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse address with special characters',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢,المنامة ٣١٦,  البحرين',
            locale: 'ar-BH',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'البحرين',
                countryCode: 'BH'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'السيد عبد الله احمد, عمارة ٢٢٢,المنامة ٣١٦, Bahrain',
            locale: 'en-US',
            expected: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: 'المنامة',
                postalCode: '٣١٦',
                country: 'Bahrain',
                countryCode: 'BH'
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

describe('Address formatting for Bahrain', () => {
    const testCases = [
        {
            name: 'should format address for Arabic locale',
            addressData: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                locality: ' المنامة',
                postalCode: '٣١٦',
                country: '  البحرين',
                countryCode: 'BH'
            },
            locale: 'ar-BH',
            expected: 'السيد عبد الله احمد, عمارة ٢٢٢\nالمنامة ٣١٦\n البحرين'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'السيد عبد الله احمد, عمارة ٢٢٢',
                postalCode: '٣١٦',
                locality: ' المنامة',
                country: 'Bahrain',
                countryCode: 'BH'
            },
            locale: 'en-US',
            expected: 'السيد عبد الله احمد, عمارة ٢٢٢\nالمنامة ٣١٦\nBahrain'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
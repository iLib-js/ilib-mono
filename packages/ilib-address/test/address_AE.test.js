/*
 * address_AE.test.js - test the address parsing and formatting routines for United Arab Emirates
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
        LocaleData.clearCache();
        let promise = Promise.resolve(true);
        ["ar-AE", "en-US"].forEach(locale => {
            promise = promise.then(() => {
                return LocaleData.ensureLocale(locale);
            });
        });
        await promise;
    }
});

describe('Address parsing for United Arab Emirates', () => {
    const testCases = [
        {
            name: 'should parse normal address with Arabic name, PO box, city and country',
            address: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١\nدبي\nالإمارات العربية المتحدة',
            locale: 'ar-AE',
            expected: {
                streetAddress: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١',
                locality: 'دبي',
                country: 'الإمارات العربية المتحدة',
                countryCode: 'AE'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'تاج قصر الفندق\nصندوق البريد بالبوسطة\n٤٢٢١١\nدبي\nالإمارات العربية المتحدة\n\n',
            locale: 'ar-AE',
            expected: {
                streetAddress: 'تاج قصر الفندق, صندوق البريد بالبوسطة, ٤٢٢١١',
                locality: 'دبي',
                country: 'الإمارات العربية المتحدة',
                countryCode: 'AE'
            }
        },
        {
            name: 'should parse single-line address',
            address: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١ دبي الإمارات العربية المتحدة',
            locale: 'ar-AE',
            expected: {
                streetAddress: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١',
                locality: 'دبي',
                country: 'الإمارات العربية المتحدة',
                countryCode: 'AE'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١ دبي الإمارات العربية المتحدة',
            locale: 'ar-AE',
            expected: {
                streetAddress: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١',
                locality: 'دبي',
                country: 'الإمارات العربية المتحدة',
                countryCode: 'AE'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'فندق تاج بالاس مكتب بريد صندوق ٤٢٢١١\nدبي\nUnited Arab Emirates',
            locale: 'en-US',
            expected: {
                streetAddress: 'فندق تاج بالاس مكتب بريد صندوق ٤٢٢١١',
                locality: 'دبي',
                country: 'United Arab Emirates',
                countryCode: 'AE'
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

describe('Address formatting for United Arab Emirates', () => {
    const testCases = [
        {
            name: 'should format address for Arabic locale',
            addressData: {
                streetAddress: 'فندق تاج بالاس مكتب بريد صندوق ٤٢٢١١',
                locality: 'دبي',
                region: null,
                postalCode: null,
                country: 'الإمارات العربية المتحدة',
                countryCode: 'AE'
            },
            locale: 'ar-AE',
            expected: 'فندق تاج بالاس مكتب بريد صندوق ٤٢٢١١\nدبي\nالإمارات العربية المتحدة'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١',
                locality: 'دبي',
                region: null,
                postalCode: null,
                country: 'United Arab Emirates',
                countryCode: 'AE'
            },
            locale: 'en-US',
            expected: 'تاج قصر الفندق صندوق البريد بالبوسطة ٤٢٢١١\nدبي\nUnited Arab Emirates'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
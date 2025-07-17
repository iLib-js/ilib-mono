/*
 * address_SY.test.js - test the address parsing and formatting routines for Syria
 *
 * Copyright © 2013, 2025 JEDLSoft
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
        await LocaleData.ensureLocale("ar-SY");
    }
});

describe('Address parsing for Syria', () => {
    const testCases = [
        {
            name: 'should parse normal address with Arabic name, street, postal code, city and country',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n٠١٠٠ ﺪﻤﺸﻗ\nسوريا',
            locale: 'ar-SY',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'سوريا',
                countryCode: 'SY'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\nﺪﻤﺸﻗ\nسوريا',
            locale: 'ar-SY',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                country: 'سوريا',
                countryCode: 'SY'
            }
        },
        {
            name: 'should parse address without country',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n٠١٠٠ ﺪﻤﺸﻗ',
            locale: 'ar-SY',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                countryCode: 'SY'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦  ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\nﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١\n٠١٠٠\nﺪﻤﺸﻗ\n\nسوريا\n\n\n',
            locale: 'ar-SY',
            expected: {
                streetAddress: 'ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ, ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'سوريا',
                countryCode: 'SY'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦  ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n\n\tﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١\n\n\t٠١٠٠\n\n\tﺪﻤﺸﻗ\n\n\tسوريا\n\n\n',
            locale: 'ar-SY',
            expected: {
                streetAddress: 'ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ, ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'سوريا',
                countryCode: 'SY'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n٠١٠٠\nﺪﻤﺸﻗ\nSyria',
            locale: 'en-US',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'Syria',
                countryCode: 'SY'
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

describe('Address formatting for Syria', () => {
    const testCases = [
        {
            name: 'should format address for Arabic locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'سوريا',
                countryCode: 'SY'
            },
            locale: 'ar-SY',
            expected: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n٠١٠٠ ﺪﻤﺸﻗ\nسوريا'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ',
                locality: 'ﺪﻤﺸﻗ',
                postalCode: '٠١٠٠',
                country: 'Syria',
                countryCode: 'SY'
            },
            locale: 'en-US',
            expected: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﻊﻠﻳ ٠١ ٠٢/٠٠٩١ ﺵﺍﺮﻋ ﻱﻮﺴﻓ ﻻ ٢٥٠٦ ﺎﻟﺰﻳ ﺎﻠﻣﺩﺮﺴﻳ\n٠١٠٠ ﺪﻤﺸﻗ\nSyria'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
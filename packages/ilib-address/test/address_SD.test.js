/*
 * address_SD.test.js - test the address parsing and formatting routines for Sudan
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
        await LocaleData.ensureLocale("ar-SD");
    }
});

describe('Address parsing for Sudan', () => {
    const testCases = [
        {
            name: 'should parse normal address with Arabic name, street, postal code, city and country',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ\nالسودان',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\nﺎﻠﺧﺮﻃﻮﻣ\nالسودان',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse address without country',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\nﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ\n\nالسودان\n\n\n',
            locale: 'ar-OM',
            expected: {
                streetAddress: 'ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١, ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١ ,  ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ , ١١١١١ , ﺎﻠﺧﺮﻃﻮﻣ , السودان',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١, ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n\n\tﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ\n\n\t١١١١١\n\n\tﺎﻠﺧﺮﻃﻮﻣ\n\n\tالسودان\n\n\n',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١, ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١ ١١١١١  ﺎﻠﺧﺮﻃﻮﻣ السودان',
            locale: 'ar-SD',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ\nSudan',
            locale: 'en-US',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'Sudan',
                countryCode: 'SD'
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

describe('Address formatting for Sudan', () => {
    const testCases = [
        {
            name: 'should format address for Arabic locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'السودان',
                countryCode: 'SD'
            },
            locale: 'ar-SD',
            expected: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ\nالسودان'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١',
                locality: 'ﺎﻠﺧﺮﻃﻮﻣ',
                postalCode: '١١١١١',
                country: 'Sudan',
                countryCode: 'SD'
            },
            locale: 'en-US',
            expected: 'ﺎﻠﺴﻳﺩ ﻢﺤﻣﺩ ﺄﺤﻣﺩ ﻊﻠﻴﻌﻣﺍﺭﺓ ﺪﻳ ﻻ ﺍﻺﺧﺍﺀﺵﺍﺮﻋ ﺂﻟ ﻮﺴﻄﻤﻜﺘﺑ ﺏﺮﻳﺩ ٢١١\n١١١١١\nﺎﻠﺧﺮﻃﻮﻣ\nSudan'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
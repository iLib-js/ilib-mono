/*
 * address_EG.test.js - test the address parsing and formatting routines for Egypt
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
 * See the License for the Specific language governing permissions and
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
        await LocaleData.ensureLocale("ar-EG");
    }
});

describe('Address parsing for Egypt', () => {
    const testCases = [
        {
            name: 'should parse normal Egyptian address',
            input: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\nالجيزة\n١٢٤١١\nمصر",
            locale: 'ar-EG',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "مصر",
                countryCode: "EG"
            }
        },
        {
            name: 'should parse Egyptian address without zip code',
            input: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\nالجيزة\nمصر",
            locale: 'ar-EG',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: undefined,
                country: "مصر",
                countryCode: "EG"
            }
        },
        {
            name: 'should parse Egyptian address without country',
            input: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\nالجيزة\n ١٢٤١١",
            locale: 'ar-EG',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: undefined,
                countryCode: "EG"
            }
        },
        {
            name: 'should parse Egyptian address with multiple lines',
            input: "السيد محمد احمد محمود ٣٠\nشارع احمد عرابى\nآل المهندسين\nالجيزة\n١٢٤١١\nمصر\n\n",
            locale: 'ar-EG',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "مصر",
                countryCode: "EG"
            }
        },
        {
            name: 'should parse Egyptian address in one line',
            input: "السيد محمد احمد محمود ٣٠ , شارع احمد عرابى , آل المهندسين , الجيزة , ١٢٤١١ , مصر",
            locale: 'ar-EG',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "مصر",
                countryCode: "EG"
            }
        },
        {
            name: 'should parse Egyptian address from US locale',
            input: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\n الجيزة\n ١٢٤١١\nEgypt",
            locale: 'en-US',
            expected: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "Egypt",
                countryCode: "EG"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Egypt', () => {
    const testCases = [
        {
            name: 'should format Egyptian address with Arabic locale',
            address: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "مصر",
                countryCode: "EG"
            },
            locale: 'ar-EG',
            expected: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\nالجيزة\n١٢٤١١\nمصر"
        },
        {
            name: 'should format Egyptian address with US locale',
            address: {
                streetAddress: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى",
                locality: "آل المهندسين",
                region: "الجيزة",
                postalCode: "١٢٤١١",
                country: "Egypt",
                countryCode: "EG"
            },
            locale: 'en-US',
            expected: "السيد محمد احمد محمود ٣٠, شارع احمد عرابى\nآل المهندسين\nالجيزة\n١٢٤١١\nEgypt"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
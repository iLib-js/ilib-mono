/*
 * address_SA.test.js - test the address parsing and formatting routines for Saudi Arabia
 *
 * Copyright © 2013-2015, 2017, 2022-2025 JEDLSoft
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

describe('ilib-address Saudi Arabia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("ar-SA");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Saudi Arabian address in Arabic',
                input: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nالمملكة العربية السعودية",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address without postal code in Arabic',
                input: "السيد عبد الله ناصر\nمكة المكرمة\nالمملكة العربية السعودية",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: undefined,
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address without country in Arabic',
                input: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: undefined,
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address with multiple lines in Arabic',
                input: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nالمملكة العربية السعودية",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address in one line format in Arabic',
                input: "السيد عبد الله ناصر, مكة المكرمة ٢١۴۵۴, المملكة العربية السعودية",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address without delimiters in Arabic',
                input: "السيد عبد الله ناصر, مكة المكرمة ٢١۴۵۴ المملكة العربية السعودية",
                options: { locale: 'ar-SA' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address from US locale with English country',
                input: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nSAUDI ARABIA",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: undefined,
                    postalCode: "٢١۴۵۴",
                    country: "SAUDI ARABIA",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse English format Saudi Arabian address',
                input: "Zakat & Income Tax Dept,RIYADH 11187, SAUDI ARABIA",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Zakat & Income Tax Dept",
                    locality: "RIYADH",
                    region: undefined,
                    postalCode: "11187",
                    country: "SAUDI ARABIA",
                    countryCode: "SA"
                }
            },
            {
                name: 'should parse Saudi Arabian address with P.O. Box',
                input: "Mr. Ibrahim Mohamad, P.O. Box 56577, RIYADH 11564, SAUDI ARABIA",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Mr. Ibrahim Mohamad, P.O. Box 56577",
                    locality: "RIYADH",
                    region: undefined,
                    postalCode: "11564",
                    country: "SAUDI ARABIA",
                    countryCode: "SA"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, options, expected }) => {
            const parsedAddress = new Address(input, options);
            
            expect(parsedAddress).toBeDefined();
            
            if (expected.streetAddress !== undefined) {
                expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            }
            if (expected.locality !== undefined) {
                expect(parsedAddress.locality).toBe(expected.locality);
            }
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            }
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            }
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            }
            if (expected.countryCode !== undefined) {
                expect(parsedAddress.countryCode).toBe(expected.countryCode);
            }
        });
    });

    describe('Address formatting', () => {
        const formatTestCases = [
            {
                name: 'should format Saudi Arabian address in Arabic locale',
                address: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: null,
                    postalCode: "٢١۴۵۴",
                    country: "المملكة العربية السعودية",
                    countryCode: "SA"
                },
                options: { locale: 'ar-SA' },
                expected: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nالمملكة العربية السعودية"
            },
            {
                name: 'should format Saudi Arabian address with English country name',
                address: {
                    streetAddress: "السيد عبد الله ناصر",
                    locality: "مكة المكرمة",
                    region: null,
                    postalCode: "٢١۴۵۴",
                    country: "SAUDI ARABIA",
                    countryCode: "SA"
                },
                options: { locale: 'ar-SA' },
                expected: "السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nSAUDI ARABIA"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
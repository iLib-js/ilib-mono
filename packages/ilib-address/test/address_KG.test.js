/*
 * address_KG.test.js - test the address parsing and formatting routines for Kyrgyzstan
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

let setUpPerformed = false;

describe('Address parsing and formatting for Kyrgyzstan', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ru-KG");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Kyrgyz address with postal code',
                input: "720001 БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара\nКиргизия",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address without postal code',
                input: "БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара\nКиргизия",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address without country specified',
                input: "720001 БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address with multiple lines',
                input: "720001\nБИШКЕК\nПроспект Чуй\n193\nкв. 28 Колупаева\nАнара\nКиргизия\n\n\n",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева, Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address in single line format',
                input: "720001 , БИШКЕК , Проспект Чуй , 193 , кв. 28 Колупаева , Анара , Киргизия",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева, Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address with superfluous whitespace',
                input: "\t\t\t720001\t\t\nБИШКЕК\t\t\nПроспект Чуй\t\t193\t\tкв. 28 Колупаева\t\tАнара\t\nКиргизия\n\n\n",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй 193 кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address without delimiters',
                input: "720001 БИШКЕК Проспект Чуй 193 кв. 28 Колупаева Анара Киргизия",
                locale: 'ru-KG',
                expected: {
                    streetAddress: "Проспект Чуй 193 кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Киргизия",
                    countryCode: "KG"
                }
            },
            {
                name: 'should parse Kyrgyz address from US locale context',
                input: "720001 БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара\nKyrgyzstan",
                locale: 'en-US',
                expected: {
                    streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                    locality: "БИШКЕК",
                    postalCode: "720001",
                    country: "Kyrgyzstan",
                    countryCode: "KG"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
            expect(parsedAddress.locality).toBe(expected.locality);
            
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            } else {
                expect(parsedAddress.postalCode).toBeUndefined();
            }
            
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            } else {
                expect(parsedAddress.country).toBeUndefined();
            }
            
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Kyrgyz address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                locality: "БИШКЕК",
                postalCode: "720001",
                country: "Киргизия",
                countryCode: "KG"
            }, { locale: 'ru-KG' });

            const expected = "720001 БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара\nКиргизия";
            const formatter = new AddressFmt({ locale: 'ru-KG' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Kyrgyz address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Проспект Чуй, 193, кв. 28 Колупаева Анара",
                locality: "БИШКЕК",
                postalCode: "720001",
                country: "Kyrgyzstan",
                countryCode: "KG"
            }, { locale: 'en-US' });

            const expected = "720001 БИШКЕК\nПроспект Чуй, 193, кв. 28 Колупаева Анара\nKyrgyzstan";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
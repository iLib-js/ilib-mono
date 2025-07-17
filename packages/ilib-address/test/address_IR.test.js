/*
 * address_IR.test.js - test the address parsing and formatting routines for Iran
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

describe('Address parsing and formatting for Iran', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("fa-IR");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Iranian address with all components',
                input: "خانم فاطمه, شماره طبقه, فرهنگ, تهران, ۱۱۹۳۶۵۴۴۷۱, ایران",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address without postal code',
                input: "خانم فاطمه,شماره  طبقه, فرهنگ, تهران, ایران",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address with multiple lines',
                input: "خانم فاطمه\nشماره  طبقه\nفرهنگ, تهران ۱۱۹۳۶۵۴۴۷۱\nایران",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address in single line format',
                input: "خانم فاطمه,شماره  طبقه,فرهنگ, تهران ۱۱۹۳۶۵۴۴۷۱ ایران",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address with superfluous whitespace',
                input: "خانم فاطمه,شماره  طبقه   \n\t\n فرهنگ, تهران ۱۱۹۳۶۵۴۴۷۱\t\n\n ایران  \n  \t\t\t",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address without delimiters',
                input: "خانم فاطمه شماره  طبقه فرهنگ, تهران ۱۱۹۳۶۵۴۴۷۱ ایران",
                locale: 'fa-IR',
                expected: {
                    streetAddress: "خانم فاطمه شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "ایران",
                    countryCode: "IR"
                }
            },
            {
                name: 'should parse Iranian address from US locale context',
                input: "خانم فاطمه,شماره  طبقه,فرهنگ, تهران ۱۱۹۳۶۵۴۴۷۱,Iran",
                locale: 'en-US',
                expected: {
                    streetAddress: "خانم فاطمه, شماره طبقه",
                    locality: "فرهنگ",
                    region: "تهران",
                    postalCode: "۱۱۹۳۶۵۴۴۷۱",
                    country: "Iran",
                    countryCode: "IR"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            } else {
                expect(parsedAddress.postalCode).toBeUndefined();
            }
            
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Iranian address with all components', () => {
            const parsedAddress = new Address({
                streetAddress: "خانم فاطمه,شماره  طبقه",
                locality: "فرهنگ",
                region: "تهران",
                postalCode: "۱۱۹۳۶۵۴۴۷۱",
                country: "ایران",
                countryCode: "IR"
            }, { locale: 'fa-IR' });

            const expected = "خانم فاطمه,شماره طبقه\nفرهنگ\nتهران\n۱۱۹۳۶۵۴۴۷۱\nایران";
            const formatter = new AddressFmt({ locale: 'fa-IR' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Iranian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "خانم فاطمه,شماره  طبقه",
                postalCode: "۱۱۹۳۶۵۴۴۷۱",
                country: "Iran",
                countryCode: "IR"
            }, { locale: 'en-US' });

            const expected = "خانم فاطمه,شماره طبقه\n۱۱۹۳۶۵۴۴۷۱\nIran";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
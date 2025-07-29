/*
 * address_IQ.test.js - test the address parsing and formatting routines for Iraq
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

describe('Address parsing and formatting for Iraq', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-IQ");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Iraqi address with all components',
                input: "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي , البصرة\n٦١٠٠٢\nالعراق",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    country: "العراق",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address without postal code',
                input: "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي , البصرة\nالعراق",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    country: "العراق",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address without country specified',
                input: "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي , البصرة\n ٦١٠٠٢",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address with multiple lines',
                input: "السيد احمد طارق\n١٠ قهوة الشريعة\nالاصمعي\nالبصرة\n٦١٠٠٢\nالعراق\n\n",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    country: "العراق",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address in single line format',
                input: "السيد احمد طارق , ١٠ قهوة الشريعة , الاصمعي , البصرة , ٦١٠٠٢ , العراق",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    country: "العراق",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address without delimiters',
                input: "السيد احمد طارق, ١٠ قهوة الشريعة الاصمعي  البصرة  ٦١٠٠٢ العراق",
                locale: 'ar-IQ',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    country: "العراق",
                    countryCode: "IQ"
                }
            },
            {
                name: 'should parse Iraqi address from US locale context',
                input: "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي , البصرة\n ٦١٠٠٢\nIraq",
                locale: 'en-US',
                expected: {
                    streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                    locality: "الاصمعي",
                    region: "البصرة",
                    postalCode: "٦١٠٠٢",
                    country: "Iraq",
                    countryCode: "IQ"
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
            
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            } else {
                expect(parsedAddress.country).toBeUndefined();
            }
            
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Iraqi address with all components', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                locality: "الاصمعي",
                region: "البصرة",
                postalCode: "٦١٠٠٢",
                country: "العراق",
                countryCode: "IQ"
            }, { locale: 'ar-IQ' });

            const expected = "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي, البصرة\n٦١٠٠٢\nالعراق";
            const formatter = new AddressFmt({ locale: 'ar-IQ' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Iraqi address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد احمد طارق, ١٠ قهوة الشريعة",
                locality: "الاصمعي",
                region: "البصرة",
                postalCode: "٦١٠٠٢",
                country: "Iraq",
                countryCode: "IQ"
            }, { locale: 'en-US' });

            const expected = "السيد احمد طارق, ١٠ قهوة الشريعة\nالاصمعي, البصرة\n٦١٠٠٢\nIraq";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
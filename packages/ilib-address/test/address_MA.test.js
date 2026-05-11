/*
 * address_MA.test.js - test the address parsing and formatting routines for Morocco
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

describe('Address parsing and formatting for Morocco', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-MA");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Moroccan address',
                input: "السيد. محمد إبراهيم, بلدية خريبكة,٢٥٠٠٥ خريبكة , المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address without postal code',
                input: "السيد. محمد إبراهيم, بلدية خريبكة,خريبكة , المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address with multiple lines',
                input: "السيد. محمد إبراهيم, بلدية خريبكة\n٢٥٠٠٥ خريبكة \n المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address in single line format',
                input: "السيد. محمد إبراهيم, بلدية خريبكة,٢٥٠٠٥ خريبكة , المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address with superfluous whitespace',
                input: "السيد. محمد إبراهيم, بلدية خريبكة   \n\t\n٢٥٠٠٥ خريبكة \t\n\n  المغرب  \n  \t\t\t",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address without delimiters',
                input: "السيد. محمد إبراهيم بلدية خريبكة  ٢ شارع الاستقلال٢٥٠٠٥  خريبكة   المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم بلدية خريبكة ٢ شارع الاستقلال",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address with special characters',
                input: "السيد. محمد إبراهيم, بلدية خريبكة,٢٥٠٠٥ خريبكة , المغرب",
                locale: 'ar-MA',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "المغرب",
                    countryCode: "MA"
                }
            },
            {
                name: 'should parse Moroccan address from US locale context',
                input: "السيد. محمد إبراهيم, بلدية خريبكة,٢٥٠٠٥ خريبكة , Morocco",
                locale: 'en-US',
                expected: {
                    streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                    locality: "خريبكة",
                    postalCode: "٢٥٠٠٥",
                    country: "Morocco",
                    countryCode: "MA"
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
        test('should format Moroccan address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                locality: "طرابلس",
                country: "المغرب",
                countryCode: "MA"
            }, { locale: 'ar-MA' });

            const expected = "السيد. محمد إبراهيم, بلدية خريبكة\nطرابلس\nالمغرب";
            const formatter = new AddressFmt({ locale: 'ar-MA' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Moroccan address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد. محمد إبراهيم, بلدية خريبكة",
                locality: "طرابلس",
                country: "Morocco",
                countryCode: "MA"
            }, { locale: 'en-US' });

            const expected = "السيد. محمد إبراهيم, بلدية خريبكة\nطرابلس\nMorocco";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
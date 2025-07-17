/*
 * address_JO.test.js - test the address parsing and formatting routines for Jordan
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

describe('Address parsing and formatting for Jordan', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-JO");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Jordanian address with postal code',
                input: "رويل ٥, آل الحلب, عمان ١١٩٣٧, الأردن",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address without postal code',
                input: "رويل ٥, آل الحلب, عمان, الأردن",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address with multiple lines',
                input: "رويل ٥, آل الحلب\nعمان ١١٩٣٧\n الأردن",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address in single line format',
                input: "رويل ٥, آل الحلب,عمان ١١٩٣٧, الأردن",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address with superfluous whitespace',
                input: "رويل ٥, آل الحلب   \n\t\n عمان ١١٩٣٧\t\n\n  الأردن  \n  \t\t\t",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address with special characters',
                input: "رويل ٥, آل الحلب,عمان ١١٩٣٧, الأردن",
                locale: 'ar-JO',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "الأردن",
                    countryCode: "JO"
                }
            },
            {
                name: 'should parse Jordanian address from US locale context',
                input: "رويل ٥, آل الحلب,عمان ١١٩٣٧, Jordan",
                locale: 'en-US',
                expected: {
                    streetAddress: "رويل ٥, آل الحلب",
                    locality: "عمان",
                    postalCode: "١١٩٣٧",
                    country: "Jordan",
                    countryCode: "JO"
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
            
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Jordanian address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "رويل ٥, آل الحلب",
                locality: "عمان ١١٩٣٧",
                country: " الأردن",
                countryCode: "JO"
            }, { locale: 'ar-JO' });

            const expected = "رويل ٥, آل الحلب\nعمان ١١٩٣٧\nالأردن";
            const formatter = new AddressFmt({ locale: 'ar-JO' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Jordanian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "رويل ٥, آل الحلب",
                locality: "عمان ١١٩٣٧",
                country: "Jordan",
                countryCode: "JO"
            }, { locale: 'en-US' });

            const expected = "رويل ٥, آل الحلب\nعمان ١١٩٣٧\nJordan";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
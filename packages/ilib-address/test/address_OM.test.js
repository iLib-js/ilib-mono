/*
 * address_OM.test.js - Oman address parsing and formatting tests for ilib-address
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

describe('address_OM', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-OM");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Oman address with all components',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\nعُمان",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address without postal code',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\nعُمان",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: undefined,
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address without country',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: undefined,
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address with multiple lines',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ\n٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\n\nعُمان\n\n\n",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ, ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address in single line format',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ,  ٣٣٨ - ﺭﻮﻳ , ١١٢ , ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ , عُمان",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ, ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address with superfluous whitespace',
                address: "\t\t\tﻡﻭﺎﻘﻓ ﻑﺮﻋ\n\n\t٣٣٨ - ﺭﻮﻳ\n\n\t١١٢\n\n\tﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\n\n\tعُمان\n\n\n",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ, ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address without delimiters',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ ١١٢  ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ عُمان",
                locale: 'ar-OM',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                }
            },
            {
                name: 'should parse Oman address from US locale',
                address: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\nOman",
                locale: 'en-US',
                expected: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    region: undefined,
                    postalCode: "١١٢",
                    country: "Oman",
                    countryCode: "OM"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format Oman address in Arabic locale',
                address: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    postalCode: "١١٢",
                    country: "عُمان",
                    countryCode: "OM"
                },
                locale: 'ar-OM',
                expected: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\nعُمان"
            },
            {
                name: 'should format Oman address in US locale',
                address: {
                    streetAddress: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ",
                    locality: "ﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ",
                    postalCode: "١١٢",
                    country: "Oman",
                    countryCode: "OM"
                },
                locale: 'en-US',
                expected: "ﻡﻭﺎﻘﻓ ﻑﺮﻋ ٣٣٨ - ﺭﻮﻳ\n١١٢\nﺎﻠﻤﺴﻛﺎﺗ ﻊﻨﺑ ﻂﻴﺑ ﺎﻠﺷﺫﺍ\nOman"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
/*
 * address_YE.test.js - test the address parsing and formatting routines for Yemen
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
        await LocaleData.ensureLocale("ar-YE");
    }
});

describe('Address parsing and formatting for Yemen', () => {
    describe('Address parsing tests', () => {
        const testCases = [
            {
                name: 'should parse Yemen address in Arabic locale',
                address: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\nﻉﺪﻧ\nاليمن",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "اليمن",
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address without postal code',
                address: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\nﻉﺪﻧ\nاليمن",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "اليمن",
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address without country',
                address: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\n\nﻉﺪﻧ",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address with multiple lines',
                address: "پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\nﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ\n\nﻉﺪﻧ\n\nاليمن\n\n\n",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣, ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "اليمن",
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address on single line',
                address: "پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣ , ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣ , ﻉﺪﻧ , اليمن",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣, ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "اليمن",
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address with excessive whitespace',
                address: "\t\t\tپﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\n\n\tﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ\n\n\t\n\n\tﻉﺪﻧ\n\n\tاليمن\n\n\n",
                locale: 'ar-YE',
                expected: {
                    streetAddress: "پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣, ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "اليمن",
                    countryCode: "YE"
                }
            },
            {
                name: 'should parse Yemen address from US locale',
                address: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\n\nﻉﺪﻧ\nYemen",
                locale: 'en-US',
                expected: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    region: undefined,
                    postalCode: undefined,
                    country: "Yemen",
                    countryCode: "YE"
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

    describe('Address formatting tests', () => {
        const testCases = [
            {
                name: 'should format Yemen address in Arabic locale',
                address: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    country: "اليمن",
                    countryCode: "YE"
                },
                locale: 'ar-YE',
                expected: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\nﻉﺪﻧ\nاليمن"
            },
            {
                name: 'should format Yemen address from US locale',
                address: {
                    streetAddress: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣",
                    locality: "ﻉﺪﻧ",
                    country: "Yemen",
                    countryCode: "YE"
                },
                locale: 'en-US',
                expected: "ﺂﻗﺍی ﻢﺤﻣﺩ ﻑﻭﺍﺩ ﺂﻟ ﻑیﺽ پﺲﺗ ﻩﺍﻭ پﺱ ﺎﻧﺩﺍﺯ پﺲﺗی ﺍﺮﺳﺎﻟ ﺞﻌﺒﻫ. ١٩٩٣\nﻉﺪﻧ\nYemen"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
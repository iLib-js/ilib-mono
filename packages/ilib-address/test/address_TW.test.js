/*
 * address_TW.test.js - Taiwan address parsing and formatting tests for ilib-address
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

describe('address_TW', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("zh-Hant-TW");
        }
    });

    describe('Address parsing - Latin script', () => {
        const testCases = [
            {
                name: 'should parse normal Taiwan address in Latin script',
                address: "Level 73, Taipei 101 Tower\n7 Xinyi Road, Sec. 5\nTaipei, 110\nTaiwan",
                locale: 'en-TW',
                expected: {
                    streetAddress: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5",
                    locality: "Taipei",
                    region: undefined,
                    postalCode: "110",
                    country: "Taiwan",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address without postal code in Latin script',
                address: "3F-499, Jung-Ming S. Road, West District, Taichung, Taiwan, R.O.C.",
                locale: 'en-TW',
                expected: {
                    streetAddress: "3F-499, Jung-Ming S. Road, West District",
                    locality: "Taichung",
                    region: "Taiwan",
                    postalCode: undefined,
                    country: "R.O.C.",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address without country in Latin script',
                address: "3F, No.7\nShong-Ren Rd.\nTaipei City 11045",
                locale: 'en-TW',
                expected: {
                    streetAddress: "3F, No.7, Shong-Ren Rd.",
                    locality: "Taipei City",
                    region: undefined,
                    postalCode: "11045",
                    country: undefined,
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address with multiple lines in Latin script',
                address: "Level 73\nTaipei 101 Tower\n7 Xinyi Road\nSec. 5\nTaipei\n110\nTaiwan\n\n\n",
                locale: 'en-TW',
                expected: {
                    streetAddress: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5",
                    locality: "Taipei",
                    region: undefined,
                    postalCode: "110",
                    country: "Taiwan",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address in single line format in Latin script',
                address: "3F, 499, Jung-Ming S. Road, West District, Taichung, 403, Taiwan, R.O.C.",
                locale: 'en-TW',
                expected: {
                    streetAddress: "3F, 499, Jung-Ming S. Road, West District",
                    locality: "Taichung",
                    region: "Taiwan",
                    postalCode: "403",
                    country: "R.O.C.",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address with superfluous whitespace in Latin script',
                address: "\t\t\t3F, \t\rNo.7\n  \rShong-Ren Rd.\t\t   \n\r \t Taipei \t\tCity\r  \r \n  \tTaiwan  \t \t 110\t \n\t \r \t Taiwan\n\n\n",
                locale: 'en-TW',
                expected: {
                    streetAddress: "3F, No.7, Shong-Ren Rd.",
                    locality: "Taipei City",
                    region: "Taiwan",
                    postalCode: "110",
                    country: "Taiwan",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address without delimiters in Latin script',
                address: "3F 499 Jung-Ming S. Road West District Taichung 403 Taiwan R.O.C.",
                locale: 'en-TW',
                expected: {
                    streetAddress: "3F 499 Jung-Ming S. Road West District",
                    locality: "Taichung",
                    region: "Taiwan",
                    postalCode: "403",
                    country: "R.O.C.",
                    countryCode: "TW"
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

    describe('Address parsing - Traditional Chinese script', () => {
        const testCases = [
            {
                name: 'should parse normal Taiwan address in Traditional Chinese',
                address: "台灣高雄市苓雅區802四維三路6號18樓A",
                locale: 'zh-Hant-TW',
                expected: {
                    streetAddress: "苓雅區四維三路6號18樓A",
                    locality: "高雄市",
                    region: undefined,
                    postalCode: "802",
                    country: "台灣",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address without postal code in Traditional Chinese',
                address: "台灣台灣省台北市南港區經貿二路66號10樓",
                locale: 'zh-Hant-TW',
                expected: {
                    streetAddress: "南港區經貿二路66號10樓",
                    locality: "台北市",
                    region: "台灣省",
                    postalCode: undefined,
                    country: "台灣",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address without country in Traditional Chinese',
                address: "高雄市苓雅區 802 四維三路 6 號 26 樓",
                locale: 'zh-Hant-TW',
                expected: {
                    streetAddress: "苓雅區四維三路 6 號 26 樓",
                    locality: "高雄市",
                    region: undefined,
                    postalCode: "802",
                    country: undefined,
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address with region in Traditional Chinese',
                address: "台灣台灣省台高雄市苓雅區802四維三路6號18樓A",
                locale: 'zh-Hant-TW',
                expected: {
                    streetAddress: "苓雅區四維三路6號18樓A",
                    locality: "台高雄市",
                    region: "台灣省",
                    postalCode: "802",
                    country: "台灣",
                    countryCode: "TW"
                }
            },
            {
                name: 'should parse Taiwan address with postal code at end in Traditional Chinese',
                address: "台灣\n台灣省台高雄市苓雅區四維三路6號18樓A 80245",
                locale: 'zh-Hant-TW',
                expected: {
                    streetAddress: "苓雅區四維三路6號18樓A",
                    locality: "台高雄市",
                    region: "台灣省",
                    postalCode: "80245",
                    country: "台灣",
                    countryCode: "TW"
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
                name: 'should format Taiwan address in Latin script',
                address: {
                    streetAddress: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5",
                    locality: "Taipei",
                    region: "Taiwan",
                    postalCode: "110",
                    country: "Taiwan",
                    countryCode: "TW",
                    format: "latin"
                },
                locale: 'en-TW',
                expected: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5\nTaipei, Taiwan, 110\nTaiwan"
            },
            {
                name: 'should format Taiwan address in Traditional Chinese',
                address: {
                    streetAddress: "苓雅區四維三路6號18樓A",
                    locality: "高雄市",
                    region: "台灣省",
                    postalCode: "80212",
                    country: "中華民國",
                    countryCode: "TW",
                    format: "asian"
                },
                locale: 'zh-Hant-TW',
                expected: "中華民國\n台灣省高雄市苓雅區四維三路6號18樓A80212"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
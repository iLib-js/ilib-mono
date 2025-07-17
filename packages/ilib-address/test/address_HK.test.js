/*
 * address_HK.test.js - test the address parsing and formatting routines for Hong Kong
 *
 * Copyright © 2025 JEDLSoft
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

describe('Address parsing for Hong Kong', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("zh-Hant-HK");
        }
    });

    const addressParseTestCases = [
        {
            name: 'should parse normal Hong Kong address in Latin script',
            input: "Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay, Hong Kong",
            locale: 'en-HK',
            expected: {
                streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
                locality: "Causeway Bay",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address in Latin script without country',
            input: "Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay",
            locale: 'en-HK',
            expected: {
                streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
                locality: "Causeway Bay",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address in Latin script with double country',
            input: "Room 1301-1302, 13/F, Block A, Sea View Estate,\n2 Watson Road, Hong Kong\nHong Kong",
            locale: 'en-HK',
            expected: {
                streetAddress: "Room 1301-1302, 13/F, Block A, Sea View Estate, 2 Watson Road",
                locality: "Hong Kong",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address in Asian script',
            input: "中國香港特別行政區太古城英皇道1111號太古城中心1期19字樓",
            locale: 'zh-Hant-HK',
            expected: {
                streetAddress: "英皇道1111號太古城中心1期19字樓",
                locality: "太古城",
                region: undefined,
                postalCode: undefined,
                country: "中國香港特別行政區",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address in Asian script without country',
            input: "太古城英皇道1111號太古城中心1期19字樓",
            locale: 'zh-HK',
            expected: {
                streetAddress: "英皇道1111號太古城中心1期19字樓",
                locality: "太古城",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address on one line',
            input: "Room 1403-5, 14/F, Chinachem Exchange Square, 1 Hoi Wan Street, Quarry Bay, Hong Kong",
            locale: 'en-HK',
            expected: {
                streetAddress: "Room 1403-5, 14/F, Chinachem Exchange Square, 1 Hoi Wan Street",
                locality: "Quarry Bay",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address with superfluous whitespace',
            input: "\t\t\t10/F PCCW Tower\n\t\nTaikoo Place\n \r\n\r\r979 King's Road\n    Quarry Bay\r\r\n    Hong Kong\t\n\n\n",
            locale: 'en-HK',
            expected: {
                streetAddress: "10/F PCCW Tower, Taikoo Place, 979 King's Road",
                locality: "Quarry Bay",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address without delimiters',
            input: "Tower 1 Times Square 1 Matheson Street Room 1706 Causeway Bay Hong Kong",
            locale: 'en-HK',
            expected: {
                streetAddress: "Tower 1 Times Square 1 Matheson Street Room 1706",
                locality: "Causeway Bay",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address with special characters',
            input: "Suite 19, 1st Floor, Tǎi Gù Chung Zhong Shìn, Hăo 1111, In Huang Street, Dàpǔ Xīn Shìzhèn, Hong Kong",
            locale: 'en-HK',
            expected: {
                streetAddress: "Suite 19, 1st Floor, Tǎi Gù Chung Zhong Shìn, Hăo 1111, In Huang Street",
                locality: "Dàpǔ Xīn Shìzhèn",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        },
        {
            name: 'should parse Hong Kong address from US locale',
            input: "Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay, Hong Kong",
            locale: 'en-US',
            expected: {
                streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
                locality: "Causeway Bay",
                region: undefined,
                postalCode: undefined,
                country: "Hong Kong",
                countryCode: "HK"
            }
        }
    ];

    test.each(addressParseTestCases)("$name", ({ input, locale, expected }) => {
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

describe('Address formatting for Hong Kong', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("zh-Hant-HK");
        }
    });

    const addressFormatTestCases = [
        {
            name: 'should format Hong Kong address in Latin script',
            addressData: {
                streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
                locality: "Causeway Bay",
                country: "Hong Kong",
                countryCode: "HK",
                format: "latin"
            },
            locale: 'en-HK',
            expected: "Tower 1, Times Square, 1 Matheson Street, Room 1706\nCauseway Bay\nHong Kong"
        },
        {
            name: 'should format Hong Kong address in Asian script',
            addressData: {
                streetAddress: "英皇道1111號太古城中心1期19字樓",
                locality: "太古城",
                country: "香港",
                countryCode: "HK",
                format: "asian"
            },
            locale: 'en-HK',
            expected: "香港太古城英皇道1111號太古城中心1期19字樓"
        },
        {
            name: 'should format Hong Kong address from US locale',
            addressData: {
                streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
                locality: "Causeway Bay",
                country: "Hong Kong",
                countryCode: "HK",
                format: "latin"
            },
            locale: 'en-US',
            expected: "Tower 1, Times Square, 1 Matheson Street, Room 1706\nCauseway Bay\nHong Kong"
        }
    ];

    test.each(addressFormatTestCases)("$name", ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
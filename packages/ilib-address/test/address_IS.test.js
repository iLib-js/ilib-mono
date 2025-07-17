/*
 * address_IS.test.js - Iceland address parsing and formatting tests for ilib-address
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

describe('address_IS', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-IS");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Iceland address with all components',
                address: "Gudmundur Jonasson Travel\nBorgartun 34\n105 REYKJAVÍK\nICELAND",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Gudmundur Jonasson Travel, Borgartun 34",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "105",
                    country: "ICELAND",
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address without postal code',
                address: "Gudmundur Jonasson Travel\nBorgartun 34\nREYKJAVÍK",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Gudmundur Jonasson Travel, Borgartun 34",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address without country',
                address: "Wabbitwatchin Excursions\n121 REYKJAVÍK",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Wabbitwatchin Excursions",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "121",
                    country: undefined,
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address with multiple lines',
                address: "Elmér Fúdd\nWabbitwatchin Excursions\nPósthólf 1034\n121 REYKJAVÍK\nICELAND",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Elmér Fúdd, Wabbitwatchin Excursions, Pósthólf 1034",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "121",
                    country: "ICELAND",
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address in single line format',
                address: "Elmér Fúdd, Wabbitwatchin Excursions, Pósthólf 1034, 121 REYKJAVÍK, ICELAND",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Elmér Fúdd, Wabbitwatchin Excursions, Pósthólf 1034",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "121",
                    country: "ICELAND",
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address with superfluous whitespace',
                address: "\t\t\tElmér Fúdd\n\t\t\tWabbitwatchin Excursions, \t\t\t\r\r Pósthólf 1034, \n\t\n121 REYKJAVÍK\t\n\t \nICELAND\n\n",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Elmér Fúdd, Wabbitwatchin Excursions, Pósthólf 1034",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "121",
                    country: "ICELAND",
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address without delimiters',
                address: "Elmér Fúdd Wabbitwatchin Excursions Pósthólf 1034 121 REYKJAVÍK ICELAND",
                locale: 'en-IS',
                expected: {
                    streetAddress: "Elmér Fúdd Wabbitwatchin Excursions Pósthólf 1034",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "121",
                    country: "ICELAND",
                    countryCode: "IS"
                }
            },
            {
                name: 'should parse Iceland address from German locale',
                address: "Gudmundur Jonasson Travel\nBorgartun 34\n105 REYKJAVÍK\nisland",
                locale: 'de-DE',
                expected: {
                    streetAddress: "Gudmundur Jonasson Travel, Borgartun 34",
                    locality: "REYKJAVÍK",
                    region: undefined,
                    postalCode: "105",
                    country: "island",
                    countryCode: "IS"
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
                name: 'should format Iceland address in English locale',
                address: {
                    streetAddress: "Gudmundur Jonasson Travel, Borgartun 34",
                    locality: "REYKJAVÍK",
                    postalCode: "105",
                    country: "ISLAND",
                    countryCode: "IS"
                },
                locale: 'en-IS',
                expected: "Gudmundur Jonasson Travel, Borgartun 34\n105 REYKJAVÍK\nISLAND"
            },
            {
                name: 'should format Iceland address in German locale',
                address: {
                    streetAddress: "Gudmundur Jonasson Travel, Borgartun 34",
                    locality: "REYKJAVÍK",
                    postalCode: "105",
                    country: "island",
                    countryCode: "IS"
                },
                locale: 'de-DE',
                expected: "Gudmundur Jonasson Travel, Borgartun 34\n105 REYKJAVÍK\nisland"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
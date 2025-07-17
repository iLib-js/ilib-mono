/*
 * address_LT.test.js - test the address parsing and formatting routines for Lithuania
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

describe('ilib-address Lithuania', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("lt-LT");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Lithuanian address',
                input: "Adelei Mickienei Plento g. 17-2 Ariogala\n60249 Raseiniu r.sav\nLITHUANIA",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address without postal code',
                input: "Adelei Mickienei Plento g. 17-2 Ariogala\nRaseiniu r.sav\nLITHUANIA",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: undefined,
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address without country',
                input: "Adelei Mickienei Plento g. 17-2 Ariogala\n60249 Raseiniu r.sav",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: undefined,
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address with multiple lines',
                input: "Adelei Mickienei\nPlento g.\n17-2 Ariogala\n\n60249\n\nRaseiniu r.sav\n\n\nLITHUANIA\n\n\n",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei, Plento g., 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address in one line format',
                input: "Adelei Mickienei , Plento g. , 17-2 Ariogala , 60249 , Raseiniu r.sav , LITHUANIA",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei, Plento g., 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address with superfluous whitespace',
                input: "\t\t\tAdelei Mickienei\t\t\rPlento g.\t\t\r17-2 Ariogala\n\n60249\n\nRaseiniu r.sav\n\t LITHUANIA\n\n\n",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address without delimiters',
                input: "Adelei Mickienei Plento g. 17-2 Ariogala 60249 Raseiniu r.sav LITHUANIA",
                options: { locale: 'lt-LT' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            },
            {
                name: 'should parse Lithuanian address from US locale',
                input: "Adelei Mickienei Plento g. 17-2 Ariogala\n60249 Raseiniu r.sav\nLITHUANIA",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    region: undefined,
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, options, expected }) => {
            const parsedAddress = new Address(input, options);
            
            expect(parsedAddress).toBeDefined();
            
            if (expected.streetAddress !== undefined) {
                expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            }
            if (expected.locality !== undefined) {
                expect(parsedAddress.locality).toBe(expected.locality);
            }
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            }
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            }
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            }
            if (expected.countryCode !== undefined) {
                expect(parsedAddress.countryCode).toBe(expected.countryCode);
            }
        });
    });

    describe('Address formatting', () => {
        const formatTestCases = [
            {
                name: 'should format Lithuanian address in Lithuanian locale',
                address: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                },
                options: { locale: 'lt-LT' },
                expected: "Adelei Mickienei Plento g. 17-2 Ariogala\n60249 Raseiniu r.sav\nLITHUANIA"
            },
            {
                name: 'should format Lithuanian address in US locale',
                address: {
                    streetAddress: "Adelei Mickienei Plento g. 17-2 Ariogala",
                    locality: "Raseiniu r.sav",
                    postalCode: "60249",
                    country: "LITHUANIA",
                    countryCode: "LT"
                },
                options: { locale: 'en-US' },
                expected: "Adelei Mickienei Plento g. 17-2 Ariogala\n60249 Raseiniu r.sav\nLITHUANIA"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
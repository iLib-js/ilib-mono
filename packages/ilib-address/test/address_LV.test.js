/*
 * address_LV.test.js - test the address parsing and formatting routines for Latvia
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

describe('Address parsing and formatting for Latvia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("lv-LV");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Latvian address',
                input: "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS, LV-5417\nLATVIA",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address without postal code',
                input: "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS\nLATVIA",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address without country',
                input: "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS, LV-5417",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address with multiple lines',
                input: "Igors Biedriņš Aglonas\niela 43\nApt 1\n\nDAUGAVPILS\n\nLV-5417\nLATVIA\n\n\n",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas, iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address in single line format',
                input: "Igors Biedriņš Aglonas , iela 43 , Apt 1 , DAUGAVPILS , LV-5417 , LATVIA",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas, iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address with superfluous whitespace',
                input: "\t\t\tIgors Biedriņš Aglonas\t\t\riela 43\t\t\rApt 1\n\tDAUGAVPILS\n\tLV-5417\n\tLATVIA\n\n\n",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43 Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address without delimiters',
                input: "Igors Biedriņš Aglonas iela 43, Apt 1 DAUGAVPILS, LV-5417 LATVIA",
                locale: 'lv-LV',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
                }
            },
            {
                name: 'should parse Latvian address from US locale context',
                input: "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS, LV-5417\nLATVIA",
                locale: 'en-US',
                expected: {
                    streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                    locality: "DAUGAVPILS",
                    postalCode: "LV-5417",
                    country: "LATVIA",
                    countryCode: "LV"
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
        test('should format Latvian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                locality: "DAUGAVPILS",
                postalCode: "LV-5417",
                country: "LATVIA",
                countryCode: "LV"
            }, { locale: 'lv-LV' });

            const expected = "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS, LV-5417\nLATVIA";
            const formatter = new AddressFmt({ locale: 'lv-LV' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Latvian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Igors Biedriņš Aglonas iela 43, Apt 1",
                locality: "DAUGAVPILS",
                postalCode: "LV-5417",
                country: "LATVIA",
                countryCode: "LV"
            }, { locale: 'en-US' });

            const expected = "Igors Biedriņš Aglonas iela 43, Apt 1\nDAUGAVPILS, LV-5417\nLATVIA";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
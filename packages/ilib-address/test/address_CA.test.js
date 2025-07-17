/*
 * address_CA.test.js - test the address parsing and formatting routines for Canada
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

describe('ilib-address Canada', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await Promise.all([
                LocaleData.ensureLocale("en-CA"),
                LocaleData.ensureLocale("nl-NL")
            ]);
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse simple Canadian address',
                input: "5150 Spectrum Way\nMississauga, ON\nL4W 5G1\nCanada",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "ON",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with accents',
                input: "1253 McGill College\nSuite 250\nMontréal, QC, H2B 2Y5",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "1253 McGill College, Suite 250",
                    locality: "Montréal",
                    region: "QC",
                    postalCode: "H2B 2Y5",
                    country: undefined,
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with spelled out province',
                input: "340 Hagey Blvd\n2nd Floor\nWaterloo, Ontario, N2L 6R6",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "340 Hagey Blvd, 2nd Floor",
                    locality: "Waterloo",
                    region: "Ontario",
                    postalCode: "N2L 6R6",
                    country: undefined,
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with spelled out province with spaces',
                input: "20 Main St.\nMyTown, Prince Edward Island A1B 2C3\nCanada",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "20 Main St.",
                    locality: "MyTown",
                    region: "Prince Edward Island",
                    postalCode: "A1B 2C3",
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address without postal code',
                input: "20 Main St.\nMyTown, AB\nCanada",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "20 Main St.",
                    locality: "MyTown",
                    region: "AB",
                    postalCode: undefined,
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with multiple lines',
                input: "950 W 21st Ave\nApt 45\nCambridge\nON\nA4C 5N4",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "950 W 21st Ave, Apt 45",
                    locality: "Cambridge",
                    region: "ON",
                    postalCode: "A4C 5N4",
                    country: undefined,
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address in one line format',
                input: "5150 Spectrum Way, Mississauga, ON, L4W 5G1, Canada",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "ON",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with superfluous whitespace',
                input: "5150 Spectrum Way\n  \t \t Mississauga, \n   \t ON, \n, \n\n L4W 5G1   \n  Canada\n\n   \n\n",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "ON",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address without delimiters',
                input: "5150 Spectrum Way Mississauga ON L4W 5G1 Canada",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "ON",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with PO Box',
                input: "P.O. Box 350\nToronto ON Y5T 5T5",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "P.O. Box 350",
                    locality: "Toronto",
                    region: "ON",
                    postalCode: "Y5T 5T5",
                    country: undefined,
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse Canadian address with French elements',
                input: "20 Montée Lavalle\nÉparnay, Nouveau-Brunswick Y7Y 7Y7",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "20 Montée Lavalle",
                    locality: "Éparnay",
                    region: "Nouveau-Brunswick",
                    postalCode: "Y7Y 7Y7",
                    country: undefined,
                    countryCode: "CA"
                }
            },
            {
                name: 'should parse foreign address from Canadian locale',
                input: "Achterberglaan 23, 2345 GD Uithoorn, Netherlands",
                options: { locale: 'en-CA' },
                expected: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    region: undefined,
                    postalCode: "2345 GD",
                    country: "Netherlands",
                    countryCode: "NL"
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
                name: 'should format Canadian address in Canadian locale',
                address: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "Ontario",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                },
                options: { locale: 'en-CA' },
                expected: "5150 Spectrum Way\nMississauga, Ontario L4W 5G1\nCanada"
            },
            {
                name: 'should format Canadian address in domestic style',
                address: {
                    streetAddress: "5150 Spectrum Way",
                    locality: "Mississauga",
                    region: "Ontario",
                    postalCode: "L4W 5G1",
                    country: "Canada",
                    countryCode: "CA"
                },
                options: { locale: 'en-CA', style: 'nocountry' },
                expected: "5150 Spectrum Way\nMississauga, Ontario L4W 5G1"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
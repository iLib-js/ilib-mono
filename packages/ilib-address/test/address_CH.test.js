/*
 * address_CH.test.js - test the address parsing and formatting routines for Switzerland
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

describe('ilib-address Switzerland', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("de-CH");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Swiss address in German',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zuerich\nSWITZERLAND",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address with accents in German',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zürich\nSWITZERLAND",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zürich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address in Italian',
                input: "Mr. Hans gatto Tastentanz Via 5/16\n1234 Zurich\nSVIZZERA",
                options: { locale: 'it-CH' },
                expected: {
                    streetAddress: "Mr. Hans gatto Tastentanz Via 5/16",
                    locality: "Zurich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SVIZZERA",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address in French',
                input: "M. Hans chat Tastentanz rue 5/16\n1234 Zurich\nSUISSE",
                options: { locale: 'fr-CH' },
                expected: {
                    streetAddress: "M. Hans chat Tastentanz rue 5/16",
                    locality: "Zurich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SUISSE",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address without postal code',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16\nZuerich\nSWITZERLAND",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: undefined,
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address without country',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zuerich",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: undefined,
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address with multiple lines',
                input: "Herr Hans Katze\nTastentanzenstrasse\n5/16\n1234\nZuerich\nSWITZERLAND\n\n",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze, Tastentanzenstrasse, 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address in one line format',
                input: "Herr Hans Katze , Tastentanzenstrasse , 5/16 , 1234 , Zuerich , SWITZERLAND",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze, Tastentanzenstrasse, 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address with superfluous whitespace',
                input: "\t\t\t\Herr Hans Katze\nTastentanzenstrasse\n5/16\n\t1234\n\t\tZuerich\n\t\tSWITZERLAND\t\t",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze, Tastentanzenstrasse, 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address without delimiters',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16 1234 Zuerich SWITZERLAND",
                options: { locale: 'de-CH' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                }
            },
            {
                name: 'should parse Swiss address from US locale',
                input: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zuerich\nSWITZERLAND",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    region: undefined,
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
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
                name: 'should format Swiss address in German locale',
                address: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                },
                options: { locale: 'de-CH' },
                expected: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zuerich\nSWITZERLAND"
            },
            {
                name: 'should format Swiss address in US locale',
                address: {
                    streetAddress: "Herr Hans Katze Tastentanzenstrasse 5/16",
                    locality: "Zuerich",
                    postalCode: "1234",
                    country: "SWITZERLAND",
                    countryCode: "CH"
                },
                options: { locale: 'en-US' },
                expected: "Herr Hans Katze Tastentanzenstrasse 5/16\n1234 Zuerich\nSWITZERLAND"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
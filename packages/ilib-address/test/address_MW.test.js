/*
 * address_MW.test.js - test the address parsing and formatting routines for Malawi
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

describe('Address parsing and formatting for Malawi', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-MW");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Malawian address',
                input: "Mr. W.M. Lundu P.O. Box 30500\nLILONGWE 3\nMALAWI",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address without postal code',
                input: "Mr. W.M. Lundu P.O. Box 30500\nLILONGWE 3\nMALAWI",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address without country',
                input: "Mr. W.M. Lundu P.O. Box 30500\nLILONGWE 3",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address with multiple lines',
                input: "Mr. W.M. Lundu\nP.O. Box 30500\n\n\n\n\nLILONGWE 3\n\n\nMALAWI\n\n\n",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu, P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address in single line format',
                input: "Mr. W.M. Lundu , P.O. Box 30500 , LILONGWE 3 , MALAWI",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu, P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address with superfluous whitespace',
                input: "\t\t\tMr. W.M. Lundu\t\t\rP.O. Box 30500\t\t\r\n\n\n\nLILONGWE 3\n\t MALAWI\n\n\n",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address without delimiters',
                input: "Mr. W.M. Lundu P.O. Box 30500  LILONGWE 3 MALAWI",
                locale: 'en-MW',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            },
            {
                name: 'should parse Malawian address from US locale context',
                input: "Mr. W.M. Lundu P.O. Box 30500\n LILONGWE 3\nMALAWI",
                locale: 'en-US',
                expected: {
                    streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                    locality: "LILONGWE 3",
                    country: "MALAWI",
                    countryCode: "MW"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
            expect(parsedAddress.locality).toBe(expected.locality);
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            } else {
                expect(parsedAddress.country).toBeUndefined();
            }
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Malawian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                locality: "LILONGWE 3",
                country: "MALAWI",
                countryCode: "MW"
            }, { locale: 'en-MW' });

            const expected = "Mr. W.M. Lundu P.O. Box 30500\nLILONGWE 3\nMALAWI";
            const formatter = new AddressFmt({ locale: 'en-MW' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Malawian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Mr. W.M. Lundu P.O. Box 30500",
                locality: "LILONGWE 3",
                country: "MALAWI",
                countryCode: "MW"
            }, { locale: 'en-US' });

            const expected = "Mr. W.M. Lundu P.O. Box 30500\nLILONGWE 3\nMALAWI";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
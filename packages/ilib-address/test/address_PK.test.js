/*
 * address_PK.test.js - test the address parsing and formatting routines for Pakistan
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

describe('Address parsing and formatting for Pakistan', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-PK");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Pakistani address',
                input: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD 44000\nPAKISTAN",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address without postal code',
                input: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD\nPAKISTAN",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                    locality: "ISLAMABAD",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address without country',
                input: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD 44000",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address with multiple lines',
                input: "Mr. Nasratullah Khan\nHouse No 17-B\nStreet No 30\n\nSector F-7/1\n\nISLAMABAD\n\n44000\nPAKISTAN\n\n\n",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan, House No 17-B, Street No 30, Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address in single line format',
                input: "Mr. Nasratullah Khan , House No 17-B , Street No 30 , Sector F-7/1 , ISLAMABAD , 44000 , PAKISTAN",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan, House No 17-B, Street No 30, Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address with superfluous whitespace',
                input: "\t\t\tMr. Nasratullah Khan\t\t\rHouse No 17-B\t\t\rStreet No 30\n\nSector F-7/1\n\n\nISLAMABAD\n\t\n44000\n\n\tPAKISTAN\n\n\n",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30, Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address without delimiters',
                input: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1 ISLAMABAD 44000 PAKISTAN",
                locale: 'en-PK',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
                }
            },
            {
                name: 'should parse Pakistani address from US locale context',
                input: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD 44000\nPAKISTAN",
                locale: 'en-US',
                expected: {
                    streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                    locality: "ISLAMABAD",
                    postalCode: "44000",
                    country: "PAKISTAN",
                    countryCode: "PK"
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
        test('should format Pakistani address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                locality: "ISLAMABAD",
                postalCode: "44000",
                country: "PAKISTAN",
                countryCode: "PK"
            }, { locale: 'en-PK' });

            const expected = "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD 44000\nPAKISTAN";
            const formatter = new AddressFmt({ locale: 'en-PK' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Pakistani address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1",
                locality: "ISLAMABAD",
                postalCode: "44000",
                country: "PAKISTAN",
                countryCode: "PK"
            }, { locale: 'en-US' });

            const expected = "Mr. Nasratullah Khan House No 17-B Street No 30 Sector F-7/1\nISLAMABAD 44000\nPAKISTAN";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
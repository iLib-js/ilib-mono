/*
 * address_HR.test.js - Croatia address parsing and formatting tests for ilib-address
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

describe('address_HR', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("hr-HR");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Croatia address with all components',
                address: "Hrvoje Horvat, Ulica Maršala Tita 174, HR-51410 Opatija, Croatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address without postal code',
                address: "Hrvoje Horvat, Ulica Maršala Tita 174, HR-51410 Opatija, Croatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address with multiple lines',
                address: "Hrvoje Horvat\nUlica Maršala Tita 174\nHR-51410 Opatija\nCroatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address in single line format',
                address: "Hrvoje Horvat, Ulica Maršala Tita 174, HR-51410 Opatija, Croatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address with superfluous whitespace',
                address: "Hrvoje Horvat, Ulica Maršala Tita 174  \n\t\n HR-51410 Opatija\t\n\n Croatia  \n  \t\t\t",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address without delimiters',
                address: "Hrvoje Horvat Ulica Maršala Tita 174 HR-51410 Opatija Croatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Hrvoje Horvat Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address with special characters',
                address: "Annette Ruzicka, BISTRIČKA 9 A, 31225 BREZNICA NAŠIČKA, Croatia",
                locale: 'hr-HR',
                expected: {
                    streetAddress: "Annette Ruzicka, BISTRIČKA 9 A",
                    locality: "BREZNICA NAŠIČKA",
                    region: undefined,
                    postalCode: "31225",
                    country: "Croatia",
                    countryCode: "HR"
                }
            },
            {
                name: 'should parse Croatia address from US locale',
                address: "Hrvoje Horvat, Ulica Maršala Tita 174, HR-51410 Opatija, Croatia",
                locale: 'en-US',
                expected: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    region: undefined,
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
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
                name: 'should format Croatia address in Croatian locale',
                address: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                },
                locale: 'hr-HR',
                expected: "Hrvoje Horvat, Ulica Maršala Tita 174\nHR-51410 Opatija\nCroatia"
            },
            {
                name: 'should format Croatia address in US locale',
                address: {
                    streetAddress: "Hrvoje Horvat, Ulica Maršala Tita 174",
                    locality: "Opatija",
                    postalCode: "HR-51410",
                    country: "Croatia",
                    countryCode: "HR"
                },
                locale: 'en-US',
                expected: "Hrvoje Horvat, Ulica Maršala Tita 174\nHR-51410 Opatija\nCroatia"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
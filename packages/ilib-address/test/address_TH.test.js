/*
 * address_TH.test.js - test the address parsing and formatting routines for Thailand
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

describe('ilib-address Thailand', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("th-TH");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Thai address',
                input: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี\nเขตปทุมวัน กรุงเทพฯ 10330\nประเทศไทย",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี",
                    locality: "เขตปทุมวัน",
                    region: "กรุงเทพฯ",
                    postalCode: "10330",
                    country: "ประเทศไทย",
                    countryCode: "TH"
                }
            },
            {
                name: 'should parse Thai address without postal code',
                input: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี\nเขตปทุมวัน กรุงเทพฯ\nประเทศไทย",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี",
                    locality: "เขตปทุมวัน",
                    region: "กรุงเทพฯ",
                    postalCode: undefined,
                    country: "ประเทศไทย",
                    countryCode: "TH"
                }
            },
            {
                name: 'should parse Thai address without country',
                input: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า\nอำเภอเมือง นนทบุรี 11000",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า",
                    locality: "อำเภอเมือง",
                    region: "นนทบุรี",
                    postalCode: "11000",
                    country: undefined,
                    countryCode: "TH"
                }
            },
            {
                name: 'should parse Thai address with multiple lines',
                input: "112/119\nมณียา สมบูรณ์ ผลงานชิ้นเอก\nไทรม้า\nเขตปทุมวัน\nกรุงเทพฯ\n11000\nประเทศไทย",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "112/119, มณียา สมบูรณ์ ผลงานชิ้นเอก, ไทรม้า",
                    locality: "เขตปทุมวัน",
                    region: "กรุงเทพฯ",
                    postalCode: "11000",
                    country: "ประเทศไทย",
                    countryCode: "TH"
                }
            },
            {
                name: 'should parse Thai address in one line format',
                input: "112/119,มณียา สมบูรณ์ ผลงานชิ้นเอก,ไทรม้า\nเขตปทุมวัน,กรุงเทพฯ,11000,ประเทศไทย",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "112/119, มณียา สมบูรณ์ ผลงานชิ้นเอก, ไทรม้า",
                    locality: "เขตปทุมวัน",
                    region: "กรุงเทพฯ",
                    postalCode: "11000",
                    country: "ประเทศไทย",
                    countryCode: "TH"
                }
            },
            {
                name: 'should parse Thai address with different format',
                input: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า\nอำเภอเมือง นนทบุรี 11000\nประเทศไทย",
                options: { locale: 'th-TH' },
                expected: {
                    streetAddress: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า",
                    locality: "อำเภอเมือง",
                    region: "นนทบุรี",
                    postalCode: "11000",
                    country: "ประเทศไทย",
                    countryCode: "TH"
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
                name: 'should format Thai address in Thai locale',
                address: {
                    streetAddress: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี",
                    locality: "เขตปทุมวัน",
                    postalCode: "10330",
                    region: "กรุงเทพฯ",
                    country: "ประเทศไทย",
                    countryCode: "TH"
                },
                options: { locale: 'th-TH' },
                expected: "49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี\nเขตปทุมวัน กรุงเทพฯ 10330\nประเทศไทย"
            },
            {
                name: 'should format Thai address in US locale',
                address: {
                    streetAddress: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า",
                    locality: "อำเภอเมือง",
                    region: "นนทบุรี",
                    postalCode: "11000",
                    country: "Thailand",
                    countryCode: "TH"
                },
                options: { locale: 'en-US' },
                expected: "112/119 มณียา สมบูรณ์ ผลงานชิ้นเอก ไทรม้า\nอำเภอเมือง นนทบุรี 11000\nThailand"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
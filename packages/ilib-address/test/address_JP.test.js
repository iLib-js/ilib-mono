/*
 * address_JP.test.js - test the address parsing and formatting routines for Japan
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

describe('Address parsing and formatting for Japan', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-JP");
        }
    });

    describe('Address parsing tests - Latin format', () => {
        const parseTestCases = [
            {
                name: 'should parse simple Japanese address in Latin format',
                input: "5-2-1 Ginza, Chuo-ku\nTokyo 170-3293\nJapan",
                locale: 'en-JP',
                expected: {
                    streetAddress: "5-2-1 Ginza",
                    locality: "Chuo-ku",
                    region: "Tokyo",
                    postalCode: "170-3293",
                    country: "Japan",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse normal Japanese address in Latin format',
                input: "Tokyo Central Post Office\n208 5-3, Yaesu 1-Chome\nChuo-ku, Tokyo 100-8994\nJapan",
                locale: 'en-JP',
                expected: {
                    streetAddress: "Tokyo Central Post Office, 208 5-3, Yaesu 1-Chome",
                    locality: "Chuo-ku",
                    region: "Tokyo",
                    postalCode: "100-8994",
                    country: "Japan",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address without postal code in Latin format',
                input: "Tokyo Central Post Office\n208 5-3, Yaesu 1-Chome\nChuo-ku, Tokyo\nJapan",
                locale: 'en-JP',
                expected: {
                    streetAddress: "Tokyo Central Post Office, 208 5-3, Yaesu 1-Chome",
                    locality: "Chuo-ku",
                    region: "Tokyo",
                    country: "Japan",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address without country in Latin format',
                input: "Tokyo Central Post Office\n208 5-3, Yaesu 1-Chome\nChuo-ku, Tokyo 100-8994",
                locale: 'en-JP',
                expected: {
                    streetAddress: "Tokyo Central Post Office, 208 5-3, Yaesu 1-Chome",
                    locality: "Chuo-ku",
                    region: "Tokyo",
                    postalCode: "100-8994",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address with multiple lines in Latin format',
                input: "Tokyo Central Post Office\n208 5-3\nYaesu 1-Chome\nChuo-ku\nTokyo\n100-8994\nJapan\n\n\n",
                locale: 'en-JP',
                expected: {
                    streetAddress: "Tokyo Central Post Office, 208 5-3, Yaesu 1-Chome",
                    locality: "Chuo-ku",
                    region: "Tokyo",
                    postalCode: "100-8994",
                    country: "Japan",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address in single line Latin format',
                input: "6-11 SHIMOHONDA, KOYASU-CHO, HACHIOJI, TOKYO 192-0993, JAPAN",
                locale: 'en-JP',
                expected: {
                    streetAddress: "6-11 SHIMOHONDA, KOYASU-CHO",
                    locality: "HACHIOJI",
                    region: "TOKYO",
                    postalCode: "192-0993",
                    country: "JAPAN",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address with superfluous whitespace in Latin format',
                input: "\t\t\t6-11 SHIMOHONDA \r\t   \tKOYASU-CHO\t\t\t, HACHIOJI-SHI \r\tTOKYO 192-0993\t\n\n\nJAPAN",
                locale: 'en-JP',
                expected: {
                    streetAddress: "6-11 SHIMOHONDA KOYASU-CHO",
                    locality: "HACHIOJI-SHI",
                    region: "TOKYO",
                    postalCode: "192-0993",
                    country: "JAPAN",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address without delimiters in Latin format',
                input: "6-11 SHIMOHONDA KOYASU-CHO HACHIOJI-SHI TOKYO 192-0993 JAPAN",
                locale: 'en-JP',
                expected: {
                    streetAddress: "6-11 SHIMOHONDA KOYASU-CHO",
                    locality: "HACHIOJI-SHI",
                    region: "TOKYO",
                    postalCode: "192-0993",
                    country: "JAPAN",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address from US locale context',
                input: "208 Tianhe Road, Tianhe District,\nChūō, Tōkyō 192-0993\nJapan",
                locale: 'en-US',
                expected: {
                    streetAddress: "208 Tianhe Road, Tianhe District",
                    locality: "Chūō",
                    region: "Tōkyō",
                    postalCode: "192-0993",
                    country: "Japan",
                    countryCode: "JP"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            
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

    describe('Address parsing tests - Asian format', () => {
        const parseTestCases = [
            {
                name: 'should parse Japanese address in Asian format with postal code prefix',
                input: "〒150-2345 東京都渋谷区本町2丁目4-7サニーマンション203",
                locale: 'ja-JP',
                expected: {
                    streetAddress: "本町2丁目4-7サニーマンション203",
                    locality: "渋谷区",
                    region: "東京都",
                    postalCode: "〒150-2345",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address in Asian format with multiple lines',
                input: "〒108-8282\n東京都港区港南2-16-1\n品川イーストワンタワー",
                locale: 'ja-JP',
                expected: {
                    streetAddress: "港南2-16-1品川イーストワンタワー",
                    locality: "港区",
                    region: "東京都",
                    postalCode: "〒108-8282",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address in Asian format with postal code suffix',
                input: "623-0006京都府綾部市有岡町田坂１６",
                locale: 'ja-JP',
                expected: {
                    streetAddress: "有岡町田坂１６",
                    locality: "綾部市",
                    region: "京都府",
                    postalCode: "623-0006",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address in Asian format without postal code',
                input: "東京都港区港南2-16-1n品川イーストワンタワー",
                locale: 'ja-JP',
                expected: {
                    streetAddress: "港南2-16-1n品川イーストワンタワー",
                    locality: "港区",
                    region: "東京都",
                    countryCode: "JP"
                }
            },
            {
                name: 'should parse Japanese address in Asian format without country',
                input: "100-8994東京都中央区\n東京中央郵便局、2085-3、八重洲1丁目",
                locale: 'ja-JP',
                expected: {
                    streetAddress: "東京中央郵便局、2085-3、八重洲1丁目",
                    locality: "中央区",
                    region: "東京都",
                    postalCode: "100-8994",
                    countryCode: "JP"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            } else {
                expect(parsedAddress.postalCode).toBeUndefined();
            }
            
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Japanese address in Latin format', () => {
            const parsedAddress = new Address({
                streetAddress: "208 Tianhe Road, Tianhe District",
                locality: "Chūō",
                region: "Tōkyō",
                postalCode: "192-0993",
                country: "Japan",
                countryCode: "JP",
                format: "latin"
            }, { locale: 'en-JP' });

            const expected = "208 Tianhe Road, Tianhe District\nChūō, Tōkyō 192-0993\nJapan";
            const formatter = new AddressFmt({ locale: 'en-JP' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Japanese address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "208 Tianhe Road, Tianhe District",
                locality: "Chūō",
                region: "Tōkyō",
                postalCode: "192-0993",
                country: "Japan",
                countryCode: "JP",
                format: "latin"
            }, { locale: 'en-US' });

            const expected = "208 Tianhe Road, Tianhe District\nChūō, Tōkyō 192-0993\nJapan";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Japanese address in Asian format', () => {
            const parsedAddress = new Address({
                streetAddress: "本町2丁目4-7サニーマンション203",
                locality: "渋谷区",
                region: "東京都",
                postalCode: "〒150-2345",
                countryCode: "JP",
                format: "asian"
            }, { locale: 'ja-JP' });

            const expected = "〒150-2345\n東京都渋谷区本町2丁目4-7サニーマンション203";
            const formatter = new AddressFmt({ locale: 'ja-JP' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
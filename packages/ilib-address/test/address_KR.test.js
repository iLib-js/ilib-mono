/*
 * address_KR.test.js - South Korea address parsing and formatting tests for ilib-address
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

describe('address_KR', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ko-KR");
        }
    });

    describe('Address parsing - English locale', () => {
        const testCases = [
            {
                name: 'should parse normal South Korea address with all components',
                address: "Seoul National University, 1 Gwanak-ro, Gwanak-gu, Seoul 151-742\nSOUTH KOREA",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    region: undefined,
                    postalCode: "151-742",
                    country: "SOUTH KOREA",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address with region',
                address: "Chuncheon National University of Education.\nGongji Ro 126, Chuncheon 200-703, Gangwon-Do, Republic of Korea",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Chuncheon National University of Education., Gongji Ro 126",
                    locality: "Chuncheon",
                    region: "Gangwon-Do",
                    postalCode: "200-703",
                    country: "Republic of Korea",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address without postal code',
                address: "Seoul National University, 1 Gwanak-ro, Gwanak-gu, Seoul\nSOUTH KOREA",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    region: undefined,
                    postalCode: undefined,
                    country: "SOUTH KOREA",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address without country',
                address: "Seoul National University, 1 Gwanak-ro, Gwanak-gu, Seoul 151-742",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    region: undefined,
                    postalCode: "151-742",
                    country: undefined,
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address with multiple lines',
                address: "Seoul National University\n1 Gwanak-ro\nGwanak-gu\nSeoul\n151-742\nKorea\n",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    region: undefined,
                    postalCode: "151-742",
                    country: "Korea",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in single line format',
                address: "Seoul National University, 1 Gwanak-ro, Gwanak-gu, Seoul 151-742, SOUTH KOREA",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    region: undefined,
                    postalCode: "151-742",
                    country: "SOUTH KOREA",
                    countryCode: "KR"
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

    describe('Address parsing - Korean locale', () => {
        const testCases = [
            {
                name: 'should parse normal South Korea address in Korean with all components',
                address: "대한민국\n151-742 서울시 관악구 관악로 1 서울대학교",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "관악구 관악로 1 서울대학교",
                    locality: "서울시",
                    region: undefined,
                    postalCode: "151-742",
                    country: "대한민국",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in Korean with brackets',
                address: "(609-735) 부산광역시 금정구 부산대학로63번길 2 (장전동)",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "금정구 부산대학로63번길 2 (장전동)",
                    locality: "부산광역시",
                    region: undefined,
                    postalCode: "(609-735)",
                    country: undefined,
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in Korean with region',
                address: "(200-703) 강원도 춘천시 공지로 126(석사동)",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "공지로 126(석사동)",
                    locality: "춘천시",
                    region: "강원도",
                    postalCode: "(200-703)",
                    country: undefined,
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in Korean without postal code',
                address: "대한민국\n서울시 관악구 관악로 1 서울대학교",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "관악구 관악로 1 서울대학교",
                    locality: "서울시",
                    region: undefined,
                    postalCode: undefined,
                    country: "대한민국",
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in Korean without country',
                address: "151-742 서울시 관악구 관악로 1 서울대학교",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "관악구 관악로 1 서울대학교",
                    locality: "서울시",
                    region: undefined,
                    postalCode: "151-742",
                    country: undefined,
                    countryCode: "KR"
                }
            },
            {
                name: 'should parse South Korea address in Korean with multiple lines',
                address: "대한민국\n151-742\n서울시\n관악구 관악로\n1 서울대학교",
                locale: 'ko-KR',
                expected: {
                    streetAddress: "관악구 관악로 1 서울대학교",
                    locality: "서울시",
                    region: undefined,
                    postalCode: "151-742",
                    country: "대한민국",
                    countryCode: "KR"
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
                name: 'should format South Korea address in Korean locale',
                address: {
                    streetAddress: "관악구 관악로 1 서울대학교",
                    locality: "서울시",
                    postalCode: "151-742",
                    country: "대한민국",
                    countryCode: "KR",
                    format: "asian"
                },
                locale: 'ko-KR',
                expected: "대한민국\n151-742 서울시 관악구 관악로 1 서울대학교"
            },
            {
                name: 'should format South Korea address in English locale',
                address: {
                    streetAddress: "Seoul National University, 1 Gwanak-ro, Gwanak-gu",
                    locality: "Seoul",
                    postalCode: "151-742",
                    country: "SOUTH KOREA",
                    countryCode: "KR"
                },
                locale: 'en-KR',
                expected: "Seoul National University, 1 Gwanak-ro, Gwanak-gu\nSeoul 151-742\nSOUTH KOREA"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
/*
 * address_SG.test.js - test the address parsing and formatting routines for Singapore
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

describe('ilib-address Singapore', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            let promise = Promise.resolve(true);
            ["en-SG", "zh-Hans-SG"].forEach(locale => {
                promise = promise.then(() => {
                    return LocaleData.ensureLocale(locale);
                });
            });
            await promise;
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Singapore address in Latin format',
                input: "#38-01/01A\n8 Shenton Way\nSingapore 068811\nSingapore",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "#38-01/01A, 8 Shenton Way",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "068811",
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address without postal code in Latin format',
                input: "9 Changi Business Park Central 1\nSingapore",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "9 Changi Business Park Central 1",
                    locality: undefined,
                    region: undefined,
                    postalCode: undefined,
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address without country in Latin format',
                input: "#38-01/01A\n8 Shenton Way\nSingapore 068811",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "#38-01/01A, 8 Shenton Way",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "068811",
                    country: undefined,
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse normal Singapore address in Asian format',
                input: "新加坡159088新加坡麟記路4＃06-07/08矽統科技大廈",
                options: { locale: 'zh-SG' },
                expected: {
                    streetAddress: "麟記路4＃06-07/08矽統科技大廈",
                    locality: "新加坡",
                    region: undefined,
                    postalCode: "159088",
                    country: "新加坡",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address without postal code in Asian format',
                input: "新加坡麟記路4＃06-07/08矽統科技大廈",
                options: { locale: 'zh-SG' },
                expected: {
                    streetAddress: "麟記路4＃06-07/08矽統科技大廈",
                    locality: undefined,
                    region: undefined,
                    postalCode: undefined,
                    country: "新加坡",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address without country in Asian format',
                input: "159088新加坡麟記路4＃06-07/08矽統科技大廈",
                options: { locale: 'zh-SG' },
                expected: {
                    streetAddress: "麟記路4＃06-07/08矽統科技大廈",
                    locality: "新加坡",
                    region: undefined,
                    postalCode: "159088",
                    country: undefined,
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address with multiple lines',
                input: "Blk 111\nAng Mo Kio Avenue 4\nSingapore\n560111\nSingapore\n\n",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "Blk 111, Ang Mo Kio Avenue 4",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "560111",
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address in one line format',
                input: "152 Beach Rd., #16-00 Gateway East, Singapore 189721, Singapore",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "152 Beach Rd., #16-00 Gateway East",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "189721",
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address with superfluous whitespace',
                input: "\t\t\t2 Orchard Turn\t\t\r\n\t#04-05\r\t ION \tOrchard\t\nSingapore \r\t\n238801\n\t\rSingapore\n\n",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "2 Orchard Turn, #04-05 ION Orchard",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "238801",
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address without delimiters',
                input: "152 Beach Rd. #16-00 Gateway East Singapore 189721 Singapore",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "152 Beach Rd. #16-00 Gateway East",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "189721",
                    country: "Singapore",
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address with special characters',
                input: "Lín Jì Lù 4\n# 06-07/08 Xì Tǒng Kējì Dàshà\nSingapore 159088\n",
                options: { locale: 'en-SG' },
                expected: {
                    streetAddress: "Lín Jì Lù 4, # 06-07/08 Xì Tǒng Kējì Dàshà",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "159088",
                    country: undefined,
                    countryCode: "SG"
                }
            },
            {
                name: 'should parse Singapore address from US locale',
                input: "#38-01/01A\n8 Shenton Way\nSingapore 068811\nSingapore",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "#38-01/01A, 8 Shenton Way",
                    locality: "Singapore",
                    region: undefined,
                    postalCode: "068811",
                    country: "Singapore",
                    countryCode: "SG"
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
                name: 'should format Singapore address in Latin format',
                address: {
                    streetAddress: "#38-01/01A, 8 Shenton Way",
                    locality: "Singapore",
                    postalCode: "068811",
                    country: "Singapore",
                    countryCode: "SG",
                    format: "latin"
                },
                options: { locale: 'en-SG' },
                expected: "#38-01/01A, 8 Shenton Way\nSingapore 068811\nSingapore"
            },
            {
                name: 'should format Singapore address in Asian format',
                address: {
                    streetAddress: "麟記路4＃06-07/08矽統科技大廈",
                    locality: "新加坡",
                    postalCode: "159088",
                    country: "新加坡共和國",
                    countryCode: "SG",
                    format: "asian"
                },
                options: { locale: 'zh-SG' },
                expected: "新加坡共和國\n159088新加坡麟記路4＃06-07/08矽統科技大廈"
            },
            {
                name: 'should format Singapore address from US locale',
                address: {
                    streetAddress: "#38-01/01A, 8 Shenton Way",
                    locality: "Singapore",
                    postalCode: "068811",
                    country: "Republic of Singapore",
                    countryCode: "SG",
                    format: "latin"
                },
                options: { locale: 'en-US' },
                expected: "#38-01/01A, 8 Shenton Way\nSingapore 068811\nRepublic of Singapore"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
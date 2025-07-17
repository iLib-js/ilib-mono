/*
 * address_CN.test.js - test the address parsing and formatting routines for China
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

describe('ilib-address China', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("en-CN");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Chinese address in Latin script',
                input: "L30, Unit 3007, Teemtower, Teemmall,\n208 Tianhe Road, Tianhe District,\nGuangzhou, Guangdong 510620\nChina",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "L30, Unit 3007, Teemtower, Teemmall, 208 Tianhe Road, Tianhe District",
                    locality: "Guangzhou",
                    region: "Guangdong",
                    postalCode: "510620",
                    country: "China",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without postal code in Latin script',
                input: "No. 1 Zhongguancun East Road\nHaidian District\nBeijing, China",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "No. 1 Zhongguancun East Road, Haidian District",
                    locality: "Beijing",
                    region: undefined,
                    postalCode: undefined,
                    country: "China",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without country in Latin script',
                input: "No.268 Xizang Zhong Road, Huangpu District\nShanghai, 200001",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "No.268 Xizang Zhong Road, Huangpu District",
                    locality: "Shanghai",
                    region: undefined,
                    postalCode: "200001",
                    country: undefined,
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse normal Chinese address in Asian script',
                input: "中国北京市朝阳区建国路112号 中国惠普大厦100022",
                options: { locale: 'zh-CN' },
                expected: {
                    streetAddress: "建国路112号 中国惠普大厦",
                    locality: "朝阳区",
                    region: "北京市",
                    postalCode: "100022",
                    country: "中国",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without postal code in Asian script',
                input: "中国武汉市汉口建设大道568号新世界国贸大厦I座9楼910室",
                options: { locale: 'zh-CN' },
                expected: {
                    streetAddress: "汉口建设大道568号新世界国贸大厦I座9楼910室",
                    locality: "武汉市",
                    region: undefined,
                    postalCode: undefined,
                    country: "中国",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without country in Asian script',
                input: "北京市朝阳区北四环中路 27号盘古大观 A 座 23层200001",
                options: { locale: 'zh-CN' },
                expected: {
                    streetAddress: "北四环中路 27号盘古大观 A 座 23层",
                    region: "北京市",
                    locality: "朝阳区",
                    postalCode: "200001",
                    country: undefined,
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without explicit city district in Asian script',
                input: "中国四川成都领事馆路4号,邮编 610041",
                options: { locale: 'zh-CN' },
                expected: {
                    streetAddress: "领事馆路4号邮编",
                    region: "四川",
                    locality: "成都",
                    postalCode: "610041",
                    country: "中国",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address with region in Asian script',
                input: "中国湖北省武汉市汉口建设大道568号新世界国贸大厦I座9楼910室430000",
                options: { locale: 'zh-CN' },
                expected: {
                    streetAddress: "汉口建设大道568号新世界国贸大厦I座9楼910室",
                    locality: "武汉市",
                    region: "湖北省",
                    country: "中国",
                    countryCode: "CN",
                    postalCode: "430000"
                }
            },
            {
                name: 'should parse Chinese address with multiple lines',
                input: "Tsinghua Science Park Bldg 6\nNo. 1 Zhongguancun East Road\nHaidian District\nBeijing 100084\nPRC\n\n",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "Tsinghua Science Park Bldg 6, No. 1 Zhongguancun East Road, Haidian District",
                    locality: "Beijing",
                    region: undefined,
                    postalCode: "100084",
                    country: "PRC",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address in one line format',
                input: "No. 27, Central North Fourth Ring Road, Chaoyang District, Beijing 100101, PRC",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "No. 27, Central North Fourth Ring Road, Chaoyang District",
                    locality: "Beijing",
                    region: undefined,
                    postalCode: "100101",
                    country: "PRC",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address with superfluous whitespace',
                input: "\t\t\tNo. 27, Central North Fourth \r\t   \tRing Road\t\t\n\t, Chaoyang \r\tDistrict\n\t\rBeijing\t\r\n100101\n\t\t\r\rPRC\t\n\n\n",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "No. 27, Central North Fourth Ring Road, Chaoyang District",
                    locality: "Beijing",
                    region: undefined,
                    postalCode: "100101",
                    country: "PRC",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address without delimiters',
                input: "No. 27 Central North Fourth Ring Road Chaoyang District Beijing 100101 PRC",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "No. 27 Central North Fourth Ring Road Chaoyang District",
                    locality: "Beijing",
                    region: undefined,
                    postalCode: "100101",
                    country: "PRC",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address with special characters',
                input: "208 Tianhe Road, Tianhe District,\nGuǎngzhōu, Guǎngdōng 510620\nChina",
                options: { locale: 'en-CN' },
                expected: {
                    streetAddress: "208 Tianhe Road, Tianhe District",
                    locality: "Guǎngzhōu",
                    region: "Guǎngdōng",
                    postalCode: "510620",
                    country: "China",
                    countryCode: "CN"
                }
            },
            {
                name: 'should parse Chinese address from US locale',
                input: "208 Tianhe Road, Tianhe District,\nGuǎngzhōu, Guǎngdōng 510620\nChina",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "208 Tianhe Road, Tianhe District",
                    locality: "Guǎngzhōu",
                    region: "Guǎngdōng",
                    postalCode: "510620",
                    country: "China",
                    countryCode: "CN"
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
                name: 'should format Chinese address in Latin script in Chinese locale',
                address: {
                    streetAddress: "208 Tianhe Road, Tianhe District",
                    locality: "Guǎngzhōu",
                    region: "Guǎngdōng",
                    postalCode: "510620",
                    country: "China",
                    countryCode: "CN",
                    format: "latin"
                },
                options: { locale: 'en-CN' },
                expected: "208 Tianhe Road, Tianhe District, Guǎngzhōu\n510620 Guǎngdōng\nChina"
            },
            {
                name: 'should format Chinese address in Latin script in US locale',
                address: {
                    streetAddress: "208 Tianhe Road, Tianhe District",
                    locality: "Guǎngzhōu",
                    region: "Guǎngdōng",
                    postalCode: "510620",
                    country: "China",
                    countryCode: "CN",
                    format: "latin"
                },
                options: { locale: 'en-US' },
                expected: "208 Tianhe Road, Tianhe District, Guǎngzhōu\n510620 Guǎngdōng\nChina"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
/*
 * address_QA.test.js - test the address parsing and formatting routines for Qatar
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("ar-QA");
    }
});

describe('Address parsing for Qatar', () => {
    const testCases = [
        {
            name: 'should parse normal address with Arabic name, PO box, city and country',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\nﺎﻟﺩﻮﺣﺓ\nقطر',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\nﺎﻟﺩﻮﺣﺓ\nقطر',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse address without country',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\n\nﺎﻟﺩﻮﺣﺓ',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ\nمكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣\n\nﺎﻟﺩﻮﺣﺓ\n\nقطر\n\n\n',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ, مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ , ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣ , ﺎﻟﺩﻮﺣﺓ , قطر',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ, ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ\n\n\tمكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣\n\n\t\n\n\tﺎﻟﺩﻮﺣﺓ\n\n\tقطر\n\n\n',
            locale: 'ar-QA',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ, مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\n\nﺎﻟﺩﻮﺣﺓ\nQatar',
            locale: 'en-US',
            expected: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'Qatar',
                countryCode: 'QA'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBeUndefined();
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Qatar', () => {
    const testCases = [
        {
            name: 'should format address for Arabic locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'قطر',
                countryCode: 'QA'
            },
            locale: 'ar-QA',
            expected: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\nﺎﻟﺩﻮﺣﺓ\nقطر'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣',
                locality: 'ﺎﻟﺩﻮﺣﺓ',
                country: 'Qatar',
                countryCode: 'QA'
            },
            locale: 'en-US',
            expected: 'ﺎﻠﺴﻳﺩ ﻊﺑﺩ ﺎﻠﻠﻫ ﺎﻠﻣﺮﻴﺨﻳ مكتب بريد ﻡﺮﺒﻋ ﺮﻘﻣ ٣٢٦٣\nﺎﻟﺩﻮﺣﺓ\nQatar'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
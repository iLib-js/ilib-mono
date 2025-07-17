/*
 * address_GE.test.js - test the address parsing and formatting routines for Georgia
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
        await LocaleData.ensureLocale("ru-GE");
    }
});

describe('Address parsing for Georgia', () => {
    const testCases = [
        {
            name: 'should parse normal Georgian address',
            input: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ 0100\nГРУЗИЯ",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address without zip code',
            input: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ\nГРУЗИЯ",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: undefined,
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address without country',
            input: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ, 0100",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: undefined,
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address with multiple lines',
            input: "Г-н Лали Хай \nУлица Казбеги 19\n\nТБИЛИСИ\n\n0100\nГРУЗИЯ\n\n\n",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай, Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address in one line',
            input: "Г-н Лали Хай , Улица Казбеги 19 , ТБИЛИСИ , 0100 , ГРУЗИЯ",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай, Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address with superfluous whitespace',
            input: "\t\t\tГ-н Лали Хай \n\t\tУлица Казбеги 19\n\n\nТБИЛИСИ\n\n0100\n\t ГРУЗИЯ\n\n\n",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай, Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address without delimiters',
            input: "Г-н Лали Хай Улица Казбеги 19 ТБИЛИСИ 0100 ГРУЗИЯ",
            locale: 'ru-GE',
            expected: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            }
        },
        {
            name: 'should parse Georgian address from US locale',
            input: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ 0100\nGeorgia",
            locale: 'en-US',
            expected: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                region: undefined,
                postalCode: "0100",
                country: "Georgia",
                countryCode: "GE"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Georgia', () => {
    const testCases = [
        {
            name: 'should format Georgian address with Russian locale',
            address: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                postalCode: "0100",
                country: "ГРУЗИЯ",
                countryCode: "GE"
            },
            locale: 'ru-GE',
            expected: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ 0100\nГРУЗИЯ"
        },
        {
            name: 'should format Georgian address with US locale',
            address: {
                streetAddress: "Г-н Лали Хай Улица Казбеги 19",
                locality: "ТБИЛИСИ",
                postalCode: "0100",
                country: "Georgia",
                countryCode: "GE"
            },
            locale: 'en-US',
            expected: "Г-н Лали Хай Улица Казбеги 19\nТБИЛИСИ 0100\nGeorgia"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
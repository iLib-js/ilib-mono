/*
 * address_BY.test.js - test the address parsing and formatting routines for Belarus
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
        await LocaleData.ensureLocale("ru-BY");
    }
});

describe('Address parsing for Belarus', () => {
    const testCases = [
        {
            name: 'should parse normal Belarusian address with all components',
            input: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\n211388, Орша\nBelarus",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address without zip code',
            input: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\nОрша\nBelarus",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: undefined,
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address without country',
            input: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\nОрша\n211388",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: undefined,
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address with multiple lines',
            input: "Адамович 4-й пер.\nЧЕРНЫШЕВСКОГО 8\n\n\n\n\nОрша\n\n211388\n\nBelarus\n\n\n",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер., ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address in one line',
            input: "Адамович 4-й пер. , ЧЕРНЫШЕВСКОГО 8 , Орша , 211388 , Belarus",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер., ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address with superfluous whitespace',
            input: "\t\t\tАдамович 4-й пер.\t\t\rЧЕРНЫШЕВСКОГО 8\t\t\r\n\n\n\nОрша\n\t211388\n\nBelarus\n\n\n",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address without delimiters',
            input: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8 Орша\n211388 Belarus",
            locale: 'ru-BY',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            }
        },
        {
            name: 'should parse Belarusian address from US locale',
            input: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\nОрша\n211388\nBelarus",
            locale: 'en-US',
            expected: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                region: undefined,
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
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

describe('Address formatting for Belarus', () => {
    const testCases = [
        {
            name: 'should format Belarusian address with Russian locale',
            address: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            },
            locale: 'ru-BY',
            expected: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\n211388, Орша\nBelarus"
        },
        {
            name: 'should format Belarusian address with US locale',
            address: {
                streetAddress: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8",
                locality: "Орша",
                postalCode: "211388",
                country: "Belarus",
                countryCode: "BY"
            },
            locale: 'en-US',
            expected: "Адамович 4-й пер. ЧЕРНЫШЕВСКОГО 8\n211388, Орша\nBelarus"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
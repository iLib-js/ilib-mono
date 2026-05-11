/*
 * address_RU.test.js - test the address parsing and formatting routines for Russia
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

describe('ilib-address Russia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("ru-RU");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Russian address with all components',
                input: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия\n247112",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    postalCode: "247112",
                    country: "Россия",
                    countryCode: "RU"
                }
            },
            {
                name: 'should parse Russian address without postal code',
                input: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    country: "Россия",
                    countryCode: "RU",
                    postalCode: undefined
                }
            },
            {
                name: 'should parse Russian address without country name',
                input: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\n247112",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    postalCode: "247112",
                    country: undefined,
                    countryCode: "RU"
                }
            },
            {
                name: 'should parse Russian address with multiple lines',
                input: "Петров Иван Сергеевич ул\nЛесная D. 5 поз\nЛесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия\n247112",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул, Лесная D. 5 поз, Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    postalCode: "247112",
                    country: "Россия",
                    countryCode: "RU"
                }
            },
            {
                name: 'should parse Russian address in one line format',
                input: "Петров Иван Сергеевич ул , Лесная D. 5 поз , Лесной , АЛЕКСЕЕВСКИЙ R-N , Воронежская область, Россия , 247112",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул, Лесная D. 5 поз, Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    postalCode: "247112",
                    country: "Россия",
                    countryCode: "RU"
                }
            },
            {
                name: 'should parse Russian address with superfluous whitespace',
                input: "Петров Иван Сергеевич ул\t\t\rЛесная D. 5 поз\t\t\rЛесной\n\tАЛЕКСЕЕВСКИЙ R-N\n\t\tВоронежская область\n\t\rРоссия\n\t\r247112",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "Петров Иван Сергеевич ул Лесная D. 5 поз Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    region: "Воронежская область",
                    postalCode: "247112",
                    country: "Россия",
                    countryCode: "RU"
                }
            },
            {
                name: 'should parse English format Russian address',
                input: "23, Ilyinka Street,Moscow, 103132, Russia",
                options: {},
                expected: {
                    streetAddress: "23, Ilyinka Street",
                    locality: "Moscow",
                    postalCode: "103132",
                    country: "Russia"
                }
            },
            {
                name: 'should parse complex Russian address with Cyrillic',
                input: "Ред Сяуаре, 3, Плосчад Револутсии Метро Сяуаре, Мосцов Циты Центре,Мосцов,103132,Россия",
                options: {},
                expected: {
                    streetAddress: "Ред Сяуаре, 3, Плосчад Револутсии Метро Сяуаре, Мосцов Циты Центре",
                    locality: "Мосцов",
                    postalCode: "103132"
                }
            },
            {
                name: 'should parse detailed Russian address with apartment',
                input: "ул. Победы, д. 20, кв. 29 пос., Октябрьский,Борский р-н,нижегородская область,Россия,606480",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "ул. Победы, д. 20, кв. 29 пос., Октябрьский",
                    locality: "Борский р-н",
                    region: "нижегородская область",
                    country: "Россия",
                    postalCode: "606480"
                }
            },
            {
                name: 'should parse Russian address with full country name',
                input: "ул. Победы, д. 20, кв. 29 пос., Октябрьский,Борский р-н,нижегородская область,Российская Федерация,606480",
                options: { locale: 'ru-RU' },
                expected: {
                    streetAddress: "ул. Победы, д. 20, кв. 29 пос., Октябрьский",
                    locality: "Борский р-н",
                    region: "нижегородская область",
                    country: "Российская Федерация",
                    postalCode: "606480"
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
                name: 'should format Russian address in Russian locale',
                address: {
                    streetAddress: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    postalCode: "247112",
                    region: "Воронежская область",
                    country: "Россия",
                    countryCode: "RU"
                },
                options: { locale: 'ru-RU' },
                expected: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия\n247112"
            },
            {
                name: 'should format Russian address in US locale',
                address: {
                    streetAddress: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной",
                    locality: "АЛЕКСЕЕВСКИЙ R-N",
                    postalCode: "247112",
                    region: "Воронежская область",
                    country: "Russia",
                    countryCode: "RU"
                },
                options: { locale: 'en-US' },
                expected: "Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nRussia\n247112"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
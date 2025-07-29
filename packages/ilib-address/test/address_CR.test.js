/*
 * address_CR.test.js - test the address parsing and formatting routines for Costa Rica
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
        await LocaleData.ensureLocale("es-CR");
    }
});

describe('Address parsing for Costa Rica', () => {
    const testCases = [
        {
            name: 'should parse normal Costa Rican address with all components',
            input: "Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address without zip code',
            input: "Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, COSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: undefined,
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address with multiple lines',
            input: "SEÑOR\nFEDERICO TERRAZAS ARIAS, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address in one line',
            input: "Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address with superfluous whitespace',
            input: "Señor Carlos Torres, Ca 15 Av 37 # 55\n\t\n Heredia,    San Rafael\t\n\n 40501\n\nCOSTA RICA  \n  \t\t\t",
            locale: 'es-CR',
            expected: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address without delimiters',
            input: "SEÑOR Gabriel Garcia Marquez Ca 15 Av 37 # 55 Heredia San Rafael, 40501, COSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "SEÑOR Gabriel Garcia Marquez Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address with special characters',
            input: "SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA",
            locale: 'es-CR',
            expected: {
                streetAddress: "SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        },
        {
            name: 'should parse Costa Rican address from US locale',
            input: "Señor Carlos Torres, Ca 15 Av 37 # 55, Heredia, San Rafael, 40501, COSTA RICA",
            locale: 'en-US',
            expected: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                country: "COSTA RICA",
                countryCode: "CR"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Costa Rica', () => {
    const testCases = [
        {
            name: 'should format Costa Rican address with Spanish locale',
            address: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                region: "Heredia",
                locality: "San Rafael",
                country: "COSTA RICA",
                postalCode: "40501",
                countryCode: "CR"
            },
            locale: 'es-CR',
            expected: "Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA"
        },
        {
            name: 'should format Costa Rican address with US locale',
            address: {
                streetAddress: "Señor Carlos Torres, Ca 15 Av 37 # 55",
                country: "COSTA RICA",
                region: "Heredia",
                locality: "San Rafael",
                postalCode: "40501",
                countryCode: "CR"
            },
            locale: 'en-US',
            expected: "Señor Carlos Torres, Ca 15 Av 37 # 55\nHeredia, San Rafael\n40501\nCOSTA RICA"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
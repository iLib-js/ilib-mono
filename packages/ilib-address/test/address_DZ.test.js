/*
 * address_DZ.test.js - test the address parsing and formatting routines for Algeria
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
 * See the License for the Specific language governing permissions and
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
        await LocaleData.ensureLocale("ar-DZ");
        await LocaleData.ensureLocale("fr-DZ");
    }
});

describe('Address parsing for Algeria (French locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Algerian address with French locale',
            input: "M. Said Mohamed, 2, rue de l'Indépendance, 16027 ALGIERS, Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address without zip code (French)',
            input: "M. Said Mohamed,2, rue de l'Indépendance, ALGIERS, Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: undefined,
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with multiple lines (French)',
            input: "M. Said Mohamed\n2, rue de l'Indépendance\n16027 ALGIERS\n Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address in one line (French)',
            input: "M. Said Mohamed,2, rue de l'Indépendance,16027 ALGIERS, Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with superfluous whitespace (French)',
            input: "M. Said Mohamed,2, rue de l'Indépendance   \n\t\n 16027 ALGIERS\t\n\n  Algérie  \n  \t\t\t",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address without delimiters (French)',
            input: "M. Said Mohamed 2  rue de l'Indépendance 16027 ALGIERS  Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed 2 rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with special characters (French)',
            input: "M. Said Mohamed,2, rue de l'Indépendance,16027 ALGIERS, Algérie",
            locale: 'fr-DZ',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address from US locale (French)',
            input: "M. Said Mohamed,2, rue de l'Indépendance,16027 ALGIERS, Algeria",
            locale: 'en-US',
            expected: {
                streetAddress: "M. Said Mohamed, 2, rue de l'Indépendance",
                region: undefined,
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algeria",
                countryCode: "DZ"
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

describe('Address parsing for Algeria (Arabic locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Algerian address with Arabic locale',
            input: "محمد سعيد, ٢ شارع الاستقلال, ١٦٠٢٦ الجزائر, الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address without zip code (Arabic)',
            input: "محمد سعيد, ٢ شارع الاستقلال, الجزائر, الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: undefined,
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with multiple lines (Arabic)',
            input: "محمد سعيد\n٢ شارع الاستقلال\n١٦٠٢٦ الجزائر\n الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address in one line (Arabic)',
            input: "محمد سعيد, ٢ شارع الاستقلال,١٦٠٢٦ الجزائر, الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with superfluous whitespace (Arabic)',
            input: "محمد سعيد, ٢ شارع الاستقلال   \n\t\n ١٦٠٢٦ الجزائر\t\n\n  الجزائر  \n  \t\t\t",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address without delimiters (Arabic)',
            input: "محمد سعيد  ٢ شارع الاستقلال ١٦٠٢٦ الجزائر  الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address with special characters (Arabic)',
            input: "محمد سعيد, ٢ شارع الاستقلال,١٦٠٢٦ الجزائر, الجزائر",
            locale: 'ar-DZ',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "الجزائر",
                countryCode: "DZ"
            }
        },
        {
            name: 'should parse Algerian address from US locale (Arabic)',
            input: "محمد سعيد, ٢ شارع الاستقلال,١٦٠٢٦ الجزائر, Algeria",
            locale: 'en-US',
            expected: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                region: undefined,
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: "Algeria",
                countryCode: "DZ"
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

describe('Address formatting for Algeria (French locale)', () => {
    const testCases = [
        {
            name: 'should format Algerian address with French locale',
            address: {
                streetAddress: "M. Said Mohamed,2, rue de l'Indépendance",
                locality: "ALGIERS",
                postalCode: "16027",
                country: "Algérie",
                countryCode: "DZ"
            },
            locale: 'fr-DZ',
            expected: "M. Said Mohamed,2, rue de l'Indépendance\n16027 ALGIERS\nAlgérie"
        },
        {
            name: 'should format Algerian address with US locale (French)',
            address: {
                streetAddress: "M. Said Mohamed,2, rue de l'Indépendance",
                postalCode: "10110",
                locality: "ALGIERS",
                country: "Algeria",
                countryCode: "DZ"
            },
            locale: 'en-US',
            expected: "M. Said Mohamed,2, rue de l'Indépendance\n10110 ALGIERS\nAlgeria"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
});

describe('Address formatting for Algeria (Arabic locale)', () => {
    const testCases = [
        {
            name: 'should format Algerian address with Arabic locale',
            address: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                locality: "الجزائر",
                postalCode: "١٦٠٢٦",
                country: " الجزائر",
                countryCode: "DZ"
            },
            locale: 'ar-DZ',
            expected: "محمد سعيد, ٢ شارع الاستقلال\n١٦٠٢٦ الجزائر\nالجزائر"
        },
        {
            name: 'should format Algerian address with US locale (Arabic)',
            address: {
                streetAddress: "محمد سعيد, ٢ شارع الاستقلال",
                postalCode: "١٦٠٢٦",
                locality: "الجزائر",
                country: "Algeria",
                countryCode: "DZ"
            },
            locale: 'en-US',
            expected: "محمد سعيد, ٢ شارع الاستقلال\n١٦٠٢٦ الجزائر\nAlgeria"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
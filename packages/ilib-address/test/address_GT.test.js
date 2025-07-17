/*
 * address_GT.test.js - test the address parsing and formatting routines for Guatemala
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("es-GT");
    }
});

describe('Address parsing for Guatemala (GT)', () => {
    const testCases = [
        {
            name: 'should parse normal Guatemalan address with name, street, zone, postal code, locality and country',
            input: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\n01012-GUATEMALA\nGUATEMALA",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address without postal code',
            input: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\nGUATEMALA\nGUATEMALA",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                country: "GUATEMALA",
                countryCode: "GT",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Guatemalan address without country name',
            input: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\n01012-GUATEMALA",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: undefined,
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address with multiple lines',
            input: "MIGUEL ÁNGEL MENCHÚ \nAVENIDA PETAPA 37\n\nZ. 12\n01012\nGUATEMALA\n\n\nGUATEMALA\n\n\n",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ, AVENIDA PETAPA 37, Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address in single line format',
            input: "MIGUEL ÁNGEL MENCHÚ , AVENIDA PETAPA 37 , Z. 12 ,01012 GUATEMALA , GUATEMALA",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ, AVENIDA PETAPA 37, Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address with superfluous whitespace',
            input: "\t\t\tMIGUEL ÁNGEL MENCHÚ \n\t\tAVENIDA PETAPA 37\n\nZ. 12\n\n01012\n\t\nGUATEMALA\n GUATEMALA\n\n\n",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ, AVENIDA PETAPA 37, Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address without delimiters',
            input: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12 01012-GUATEMALA GUATEMALA",
            expected: {
                streetAddress: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        },
        {
            name: 'should parse Guatemalan address from US locale',
            input: "MIGUEL ANGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\n01012-GUATEMALA\nGUATEMALA",
            expected: {
                streetAddress: "MIGUEL ANGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
                locality: "GUATEMALA",
                region: undefined,
                postalCode: "01012",
                country: "GUATEMALA",
                countryCode: "GT"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'es-GT' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Guatemala (GT)', () => {
    test('should format Guatemalan address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
            locality: "GUATEMALA",
            postalCode: "01012",
            country: "GUATEMALA",
            countryCode: "GT"
        }, { locale: 'es-GT' });

        const expected = "MIGUEL ÁNGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\n01012-GUATEMALA\nGUATEMALA";
        const formatter = new AddressFmt({ locale: 'es-GT' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Guatemalan address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "MIGUEL ANGEL MENCHÚ AVENIDA PETAPA 37 Z. 12",
            locality: "GUATEMALA",
            postalCode: "01012",
            country: "GUATEMALA",
            countryCode: "GT"
        }, { locale: 'en-US' });

        const expected = "MIGUEL ANGEL MENCHÚ AVENIDA PETAPA 37 Z. 12\n01012-GUATEMALA\nGUATEMALA";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
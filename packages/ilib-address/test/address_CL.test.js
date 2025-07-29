/*
 * address_CL.test.js - test the address parsing and formatting routines for Chile
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
        await LocaleData.ensureLocale("es-CL");
    }
});

describe('Address parsing for Chile', () => {
    const testCases = [
        {
            name: 'should parse normal Chilean address with all components',
            input: "Av. Bellavista N° 185, Dep. 609, 8420000, Recoleta, Chile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address without zip code',
            input: "Av. Bellavista N° 185, Dep. 609, 8420000, Recoleta, Chile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address with multiple lines',
            input: "Av. Bellavista N° 185\nDep. 609\n8420000\nRecoleta\nChile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address in one line',
            input: "Av. Bellavista N° 185, Dep. 609, 8420000, Recoleta, Chile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address with superfluous whitespace',
            input: "Av. Bellavista N° 185, Dep. 609 \n\t\n 8420000\nRecoleta\t\n\n Chile  \n  \t\t\t",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address without delimiters',
            input: "Av. Bellavista N° 185 Dep. 609 8420000 Recoleta Chile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185 Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address with special characters',
            input: "Av. Bellavista N° 185, Dep. 609, 8420000, Recoleta, Chile",
            locale: 'es-CL',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse Chilean address from US locale',
            input: "Av. Bellavista N° 185, Dep. 609, 8420000, Recoleta, Chile",
            locale: 'en-US',
            expected: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                region: undefined,
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            }
        },
        {
            name: 'should parse alternate Chilean address with all components',
            input: "Señorita Patricia Vivas, Moneda 1155, 8340457, SANTIAGO, CHILE",
            locale: 'es-CL',
            expected: {
                streetAddress: "Señorita Patricia Vivas, Moneda 1155",
                region: undefined,
                locality: "SANTIAGO",
                postalCode: "8340457",
                country: "CHILE",
                countryCode: "CL"
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

describe('Address formatting for Chile', () => {
    const testCases = [
        {
            name: 'should format Chilean address with Spanish locale',
            address: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            },
            locale: 'es-CL',
            expected: "Av. Bellavista N° 185, Dep. 609\n8420000\nRecoleta\nChile"
        },
        {
            name: 'should format Chilean address with US locale',
            address: {
                streetAddress: "Av. Bellavista N° 185, Dep. 609",
                locality: "Recoleta",
                postalCode: "8420000",
                country: "Chile",
                countryCode: "CL"
            },
            locale: 'en-US',
            expected: "Av. Bellavista N° 185, Dep. 609\n8420000\nRecoleta\nChile"
        },
        {
            name: 'should format alternate Chilean address with Spanish locale',
            address: {
                streetAddress: "Señorita Patricia Vivas Moneda 1155",
                locality: "SANTIAGO",
                postalCode: "8340457",
                country: "CHILE",
                countryCode: "CL"
            },
            locale: 'es-CL',
            expected: "Señorita Patricia Vivas Moneda 1155\n8340457\nSANTIAGO\nCHILE"
        },
        {
            name: 'should format alternate Chilean address with US locale',
            address: {
                streetAddress: "Señorita Patricia Vivas Moneda 1155",
                locality: "SANTIAGO",
                postalCode: "8340457",
                country: "CHILE",
                countryCode: "CL"
            },
            locale: 'en-US',
            expected: "Señorita Patricia Vivas Moneda 1155\n8340457\nSANTIAGO\nCHILE"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
/*
 * address_EC.test.js - test the address parsing and formatting routines for Ecuador
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
        await LocaleData.ensureLocale("es-EC");
    }
});

describe('Address parsing for Ecuador', () => {
    const testCases = [
        {
            name: 'should parse normal Ecuadorian address',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito, P0133V, QUITO, Ecuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address without zip code',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito, QUITO, Ecuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: undefined,
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address with multiple lines',
            input: "Señor Ing. Gonzalo Vargas San Martín\nEmpresa Nacional de Correos\nSuccursal No 21– Quito\nP0133V, QUITO\nEcuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address in one line',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito, P0133V, QUITO, Ecuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address with superfluous whitespace',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito  \n\t\n P0133V, QUITO\t\n\n Ecuador  \n  \t\t\t",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address without delimiters',
            input: "Señor Ing. Gonzalo Vargas San Martín Empresa Nacional de Correos Succursal No 21– Quito  P0133V QUITO Ecuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín Empresa Nacional de Correos Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address with special characters',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito, P0133V, QUITO, Ecuador",
            locale: 'es-EC',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            }
        },
        {
            name: 'should parse Ecuadorian address from US locale',
            input: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito, P0133V, QUITO, Ecuador",
            locale: 'en-US',
            expected: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín, Empresa Nacional de Correos, Succursal No 21– Quito",
                region: undefined,
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
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

describe('Address formatting for Ecuador', () => {
    const testCases = [
        {
            name: 'should format Ecuadorian address with Spanish locale',
            address: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín\nEmpresa Nacional de Correos\nSuccursal No 21– Quito",
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            },
            locale: 'es-EC',
            expected: "Señor Ing. Gonzalo Vargas San Martín\nEmpresa Nacional de Correos\nSuccursal No 21– Quito\nP0133V\nQUITO\nEcuador"
        },
        {
            name: 'should format Ecuadorian address with US locale',
            address: {
                streetAddress: "Señor Ing. Gonzalo Vargas San Martín\nEmpresa Nacional de Correos\nSuccursal No 21– Quito",
                locality: "QUITO",
                postalCode: "P0133V",
                country: "Ecuador",
                countryCode: "EC"
            },
            locale: 'es-EC',
            expected: "Señor Ing. Gonzalo Vargas San Martín\nEmpresa Nacional de Correos\nSuccursal No 21– Quito\nP0133V\nQUITO\nEcuador"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
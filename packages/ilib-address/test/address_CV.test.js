/*
 * address_CV.test.js - test the address parsing and formatting routines for Cape Verde
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
        await LocaleData.ensureLocale("pt-CV");
    }
});

describe('Address parsing for Cape Verde', () => {
    const testCases = [
        {
            name: 'should parse normal Cape Verdean address with all components',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38, 7600 PRAIA, SANTIAGO, CAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address without zip code',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38,PRAIA, SANTIAGO, CAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: undefined,
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address with multiple lines',
            input: "Luis Felipe Ramos\nRua 5 de Julho 138/Platô, C.P. 38\n7600 PRAIA\nSANTIAGO\nCAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address in one line',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38, 7600 PRAIA, SANTIAGO, CAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address with superfluous whitespace',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38  \n\t\n 7600 PRAIA, SANTIAGO\t\n\n CAPE VERDE  \n  \t\t\t",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address without delimiters',
            input: "Luis Felipe Ramos Rua 5 de Julho 138/Platô C.P. 38 7600 PRAIA SANTIAGO CAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos Rua 5 de Julho 138/Platô C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address with special characters',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38, 7600 PRAIA, SANTIAGO, CAPE VERDE",
            locale: 'pt-CV',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
            }
        },
        {
            name: 'should parse Cape Verdean address from US locale',
            input: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38, 7600 PRAIA, SANTIAGO, CAPE VERDE",
            locale: 'en-US',
            expected: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                region: "SANTIAGO",
                locality: "PRAIA",
                postalCode: "7600",
                country: "CAPE VERDE",
                countryCode: "CV"
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

describe('Address formatting for Cape Verde', () => {
    const testCases = [
        {
            name: 'should format Cape Verdean address with Portuguese locale',
            address: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                locality: "PRAIA",
                postalCode: "7600",
                region: "SANTIAGO",
                country: "CAPE VERDE",
                countryCode: "CV"
            },
            locale: 'pt-CV',
            expected: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38\n7600 PRAIA\nSANTIAGO\nCAPE VERDE"
        },
        {
            name: 'should format Cape Verdean address with US locale',
            address: {
                streetAddress: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38",
                postalCode: "7600",
                region: "SANTIAGO",
                country: "CAPE VERDE",
                locality: "PRAIA",
                countryCode: "CV"
            },
            locale: 'en-US',
            expected: "Luis Felipe Ramos, Rua 5 de Julho 138/Platô, C.P. 38\n7600 PRAIA\nSANTIAGO\nCAPE VERDE"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
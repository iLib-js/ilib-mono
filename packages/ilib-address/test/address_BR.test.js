/*
 * address_BR.test.js - test the address parsing and formatting routines for Brazil
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

describe('ilib-address Brazil', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("pt-BR");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Brazilian address',
                input: "Carlos Rossi,Avenida João Jorge, 112, ap. 31 Vila Industrial,Campinas - SP,13035-680,BRAZIL",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Carlos Rossi, Avenida João Jorge, 112, ap. 31 Vila Industrial",
                    locality: "Campinas",
                    region: "SP",
                    postalCode: "13035-680",
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address without postal code',
                input: "Avenida João Jorge, 112, ap. 31 Vila Industrial,Campinas - SP, BRAZIL",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Avenida João Jorge, 112, ap. 31 Vila Industrial",
                    locality: "Campinas",
                    region: "SP",
                    postalCode: undefined,
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address with multiple lines',
                input: "Carlos Rossi\nAvenida João Jorge, 112, ap. 31\nVila Industrial\nCampinas - SP\n13035-680\nBRAZIL",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Carlos Rossi, Avenida João Jorge, 112, ap. 31, Vila Industrial",
                    locality: "Campinas",
                    region: "SP",
                    postalCode: "13035-680",
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address in one line format',
                input: "Rua Visconde de Porto Seguro 1238, Sao Paulo - SP,BRAZIL",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Rua Visconde de Porto Seguro 1238",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: undefined,
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address with superfluous whitespace',
                input: "Rua Visconde de Porto Seguro 1238   \n\t\n Sao Paulo - SP\n\n\n BRAZIL  \n  \t\n 04642-000 \t\t\t",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Rua Visconde de Porto Seguro 1238",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: "04642-000",
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address without delimiters',
                input: "Rua Visconde de Porto Seguro Sao Paulo - SP BRAZIL  04642-000 ",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Rua Visconde de Porto Seguro",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: "04642-000",
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address with special characters',
                input: "SOCIEDADE BRASILEIRA DE FÍSICA,Caixa Postal 66328,São Paulo - SP,BRAZIL,05315-970",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "SOCIEDADE BRASILEIRA DE FÍSICA, Caixa Postal 66328",
                    locality: "São Paulo",
                    region: "SP",
                    postalCode: "05315-970",
                    country: "BRAZIL",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address from US locale',
                input: "Rua Visconde de Porto Seguro, Sao Paulo - SP, Brasil, 04642-000",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Rua Visconde de Porto Seguro",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: "04642-000",
                    country: "Brasil",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address with complex street details',
                input: "Lívia Amaral, Av. Paulista, 1098, 1º andar, apto. 101, Bela Vista, São Paulo - SP, Brasil, 01310-000",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Lívia Amaral, Av. Paulista, 1098, 1º andar, apto. 101, Bela Vista",
                    locality: "São Paulo",
                    region: "SP",
                    postalCode: "01310-000",
                    country: "Brasil",
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address without country name',
                input: "Rua Afonso Canargo, 805, Santana, Guarapuava - PR, 85070-200",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Rua Afonso Canargo, 805, Santana",
                    locality: "Guarapuava",
                    region: "PR",
                    postalCode: "85070-200",
                    country: undefined,
                    countryCode: "BR"
                }
            },
            {
                name: 'should parse Brazilian address with uppercase locality',
                input: "Boulevard das Flores 255,    SALVADOR - BA, BRAZIL, 40301-110",
                options: { locale: 'pt-BR' },
                expected: {
                    streetAddress: "Boulevard das Flores 255",
                    locality: "SALVADOR",
                    region: "BA",
                    postalCode: "40301-110",
                    country: "BRAZIL",
                    countryCode: "BR"
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
                name: 'should format Brazilian address in Brazilian locale',
                address: {
                    streetAddress: "Rua Visconde de Porto Seguro",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: "04642-000",
                    country: "BRAZIL",
                    countryCode: "BR"
                },
                options: { locale: 'pt-BR' },
                expected: "Rua Visconde de Porto Seguro\nSao Paulo-SP\nBRAZIL\n04642-000"
            },
            {
                name: 'should format Brazilian address in US locale',
                address: {
                    streetAddress: "Rua Visconde de Porto Seguro",
                    locality: "Sao Paulo",
                    region: "SP",
                    postalCode: "04642-000",
                    country: "BRAZIL",
                    countryCode: "BR"
                },
                options: { locale: 'en-US' },
                expected: "Rua Visconde de Porto Seguro\nSao Paulo-SP\nBRAZIL\n04642-000"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
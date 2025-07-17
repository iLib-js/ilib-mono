/*
 * address_BO.test.js - Bolivia address parsing and formatting tests for ilib-address
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

describe('address_BO', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-BO");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Bolivia address with all components',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580, COCHABAMBA, BOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address without postal code',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580, COCHABAMBA, BOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address with multiple lines',
                address: "SEÑOR\nFEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580\nCOCHABAMBA\nBOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address in single line format',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580, COCHABAMBA, BOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address with superfluous whitespace',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580  \n\t\n COCHABAMBA\t\n\n BOLIVIA  \n  \t\t\t",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address without delimiters',
                address: "SEÑOR FEDERICO TERRAZAS ARIAS CALLE ADELA ZAMUDIO 1716 PO BOX 580 COCHABAMBA BOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR FEDERICO TERRAZAS ARIAS CALLE ADELA ZAMUDIO 1716 PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address with special characters',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580, COCHABAMBA, BOLIVIA",
                locale: 'es-BO',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse Bolivia address from US locale',
                address: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580, COCHABAMBA, BOLIVIA",
                locale: 'en-US',
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    region: undefined,
                    postalCode: undefined,
                    country: "BOLIVIA",
                    countryCode: "BO"
                }
            },
            {
                name: 'should parse UNICEF Bolivia address',
                address: "UNICEF, United Nations Children's Fund, P.O. Box 3-12435,La Paz, Bolivia",
                locale: 'es-BO',
                expected: {
                    streetAddress: "UNICEF, United Nations Children's Fund, P.O. Box 3-12435",
                    locality: "La Paz",
                    region: undefined,
                    postalCode: undefined,
                    country: "Bolivia",
                    countryCode: "BO"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format Bolivia address in Spanish locale',
                address: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    locality: "COCHABAMBA",
                    country: "BOLIVIA",
                    countryCode: "BO"
                },
                locale: 'es-BO',
                expected: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580\nCOCHABAMBA\nBOLIVIA"
            },
            {
                name: 'should format Bolivia address in US locale',
                address: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580",
                    country: "BOLIVIA",
                    locality: "COCHABAMBA",
                    countryCode: "BO"
                },
                locale: 'en-US',
                expected: "SEÑOR, FEDERICO TERRAZAS ARIAS, CALLE ADELA ZAMUDIO 1716, PO BOX 580\nCOCHABAMBA\nBOLIVIA"
            },
            {
                name: 'should format Bolivia hotel address',
                address: {
                    streetAddress: "Calle Arturo Costa De La Torre 1359 A 1/2 Cuadra De La Plaza",
                    country: "BOLIVIA",
                    locality: "San Pedro",
                    countryCode: "BO"
                },
                locale: 'es-BO',
                expected: "Calle Arturo Costa De La Torre 1359 A 1/2 Cuadra De La Plaza\nSan Pedro\nBOLIVIA"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
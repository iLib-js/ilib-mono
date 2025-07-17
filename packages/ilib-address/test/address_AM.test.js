/*
 * address_AM.test.js - test the address parsing and formatting routines for Armenia
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
        await LocaleData.ensureLocale("en-AM");
    }
});

describe('Address parsing for Armenia (AM) - English', () => {
    const testCases = [
        {
            name: 'should parse normal Armenian address with name, street, apartment, postal code, locality and country',
            input: "Armen Simonyan, Saryan str 22 apt 25, 0002, YEREVAN, ARMENIA",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address without postal code',
            input: "Armen Simonyan, Saryan str 22 apt 25, YEREVAN, ARMENIA",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                country: "ARMENIA",
                countryCode: "AM",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Armenian address with multiple lines',
            input: "Armen Simonyan\nSaryan str 22 apt 25\n0002 YEREVAN\nARMENIA",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in single line format',
            input: "Armen Simonyan, Saryan str 22 apt 25, 0002 YEREVAN, ARMENIA",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address with superfluous whitespace',
            input: "Armen Simonyan, Saryan str 22 apt 25  \n\t\n 0002 YEREVAN\t\n\n ARMENIA  \n  \t\t\t",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address without delimiters',
            input: "Armen Simonyan P. 15 Sh. 1 0002 YEREVAN ARMENIA",
            expected: {
                streetAddress: "Armen Simonyan P. 15 Sh. 1",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address from US locale',
            input: "Armen Simonyan, Saryan str 22 apt 25, 0002 YEREVAN, ARMENIA",
            expected: {
                streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
                region: undefined,
                locality: "YEREVAN",
                postalCode: "0002",
                country: "ARMENIA",
                countryCode: "AM"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'en-AM' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address parsing for Armenia (AM) - Armenian', () => {
    const testCases = [
        {
            name: 'should parse Armenian address in Armenian script',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25 , 0002 ԵՐԵՎԱՆ , ՀԱՅԱՍՏԱՆ",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                postalCode: "0002",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in Armenian script without postal code',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25 , ԵՐԵՎԱՆ , ՀԱՅԱՍՏԱՆ",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in Armenian script with superfluous whitespace',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25 \n\t\n 0002 ԵՐԵՎԱՆ\t\n\n ՀԱՅԱՍՏԱՆ \n  \t\t\t",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                postalCode: "0002",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in Armenian script with multiple lines',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25 \n 0002 ԵՐԵՎԱՆ\n ՀԱՅԱՍՏԱՆ \n",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                postalCode: "0002",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in Armenian script without delimiters',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25  0002 ԵՐԵՎԱՆ  ՀԱՅԱՍՏԱՆ ",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                postalCode: "0002",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        },
        {
            name: 'should parse Armenian address in Armenian script from US locale',
            input: "Արմեն Սիմոնյանը , Սարյան փող 22 , բն 25  0002 ԵՐԵՎԱՆ  ՀԱՅԱՍՏԱՆ ",
            expected: {
                streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
                region: undefined,
                locality: "ԵՐԵՎԱՆ",
                postalCode: "0002",
                country: "ՀԱՅԱՍՏԱՆ",
                countryCode: "AM"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'hy-AM' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Armenia (AM)', () => {
    test('should format Armenian address in English locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
            locality: "YEREVAN",
            postalCode: "0002",
            country: "ARMENIA",
            countryCode: "AM"
        }, { locale: 'en-AM' });

        const expected = "Armen Simonyan, Saryan str 22 apt 25\n0002 YEREVAN\nARMENIA";
        const formatter = new AddressFmt({ locale: 'en-AM' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Armenian address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Armen Simonyan, Saryan str 22 apt 25",
            postalCode: "0002",
            country: "ARMENIA",
            locality: "YEREVAN",
            countryCode: "AM"
        }, { locale: 'en-US' });

        const expected = "Armen Simonyan, Saryan str 22 apt 25\n0002 YEREVAN\nARMENIA";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Armenian address in Armenian script', () => {
        const parsedAddress = new Address({
            streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
            locality: "ԵՐԵՎԱՆ",
            postalCode: "0002",
            country: "ՀԱՅԱՍՏԱՆ",
            countryCode: "AM"
        }, { locale: 'hy-AM' });

        const expected = "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25\n0002 ԵՐԵՎԱՆ\nՀԱՅԱՍՏԱՆ";
        const formatter = new AddressFmt({ locale: 'en-AM' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Armenian address in Armenian script from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25",
            locality: "ԵՐԵՎԱՆ",
            postalCode: "0002",
            country: "ՀԱՅԱՍՏԱՆ",
            countryCode: "AM"
        }, { locale: 'en-US' });

        const expected = "Արմեն Սիմոնյանը, Սարյան փող 22, բն 25\n0002 ԵՐԵՎԱՆ\nՀԱՅԱՍՏԱՆ";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
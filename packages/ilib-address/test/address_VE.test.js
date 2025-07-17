/*
 * address_VE.test.js - Venezuela address parsing and formatting tests for ilib-address
 *
 * Copyright © 2025 JEDLSoft
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

import { LocaleData } from "ilib-localedata";
import { getPlatform } from "ilib-env";
import Address from "../src/Address.js";
import AddressFmt from "../src/AddressFmt.js";

let setUpPerformed = false;

describe("Venezuela address parsing and formatting", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-VE");
        }
    });

    test("should parse a normal Venezuela address with all components", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS 1010, D.F.\nVenezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address without postal code", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS D.F.\nVenezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
        expect(parsedAddress.postalCode).toBeUndefined();
    });

    test("should parse Venezuela address without country", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS 1010, D.F.", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBeUndefined();
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address with many lines", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV.\nFUERZAS ARMADAS TORRE\nSAN JOSE\nENTRADA B PISO 5\nAPARTAMENTO 20\nCARACAS 1010, D.F.\nVenezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV., FUERZAS ARMADAS TORRE, SAN JOSE, ENTRADA B PISO 5, APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address on one line", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV. , FUERZAS ARMADAS TORRE , SAN JOSE , ENTRADA B PISO 5 , APARTAMENTO 20 , CARACAS , 1010 , D.F. , Venezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV., FUERZAS ARMADAS TORRE, SAN JOSE, ENTRADA B PISO 5, APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address with superfluous whitespace", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV.\n\n\t\rFUERZAS ARMADAS TORRE\t\t\rSAN JOSE\r\r\rENTRADA B PISO 5\t\t\rAPARTAMENTO 20\n\n\nCARACAS\t\t\r1010\r\r\rD.F.\t\t\rVenezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV., FUERZAS ARMADAS TORRE SAN JOSE ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address without delimiters", () => {
        const parsedAddress = new Address("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20 CARACAS 1010 D.F., Venezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should parse Venezuela address from US locale", () => {
        const parsedAddress = new Address("Mr. JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS 1010, D.F.\nVenezuela", {locale: "es-VE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Mr. JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20");
        expect(parsedAddress.locality).toBe("CARACAS");
        expect(parsedAddress.region).toBe("D.F.");
        expect(parsedAddress.postalCode).toBe("1010");
        expect(parsedAddress.country).toBe("Venezuela");
        expect(parsedAddress.countryCode).toBe("VE");
    });

    test("should format Venezuela address in native locale", () => {
        const parsedAddress = new Address({
            streetAddress: "SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20",
            locality: "CARACAS",
            postalCode: "1010",
            region: "D.F.",
            country: "Venezuela",
            countryCode: "VE"
        }, {locale: "es-VE"});
        const expected = "SEÑOR JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS 1010, D.F.\nVenezuela";
        const formatter = new AddressFmt({locale: "es-VE"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test("should format Venezuela address from US locale", () => {
        const parsedAddress = new Address({
            streetAddress: "Mr. JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20",
            locality: "CARACAS",
            postalCode: "1010",
            region: "D.F.",
            country: "Venezuela",
            countryCode: "VE"
        }, {locale: "en-US"});
        const expected = "Mr. JOSE PEREZ AV. FUERZAS ARMADAS TORRE SAN JOSE, ENTRADA B PISO 5 APARTAMENTO 20\nCARACAS 1010, D.F.\nVenezuela";
        const formatter = new AddressFmt({locale: "en-US"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
/*
 * address_DE.test.js - Germany address parsing and formatting tests for ilib-address
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

describe("Germany address parsing and formatting", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("de-DE");
        }
    });

    test("should parse a normal German address with all components", () => {
        const parsedAddress = new Address("Herrenberger Straße 140, 71034 Böblingen, Deutschland", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Herrenberger Straße 140");
        expect(parsedAddress.locality).toBe("Böblingen");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("71034");
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address without postal code", () => {
        const parsedAddress = new Address("Berliner Straße 111, Ratingen, Deutschland", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Berliner Straße 111");
        expect(parsedAddress.locality).toBe("Ratingen");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
        expect(parsedAddress.postalCode).toBeUndefined();
    });

    test("should parse German address without country", () => {
        const parsedAddress = new Address("Herrenberger Straße 140, 71034 Böblingen", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Herrenberger Straße 140");
        expect(parsedAddress.locality).toBe("Böblingen");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("71034");
        expect(parsedAddress.country).toBeUndefined();
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address with multiple lines", () => {
        const parsedAddress = new Address("Altrottstraße 31\nPartner Port SAP\n69190\nWalldorf/Baden\nDeutschland\n\n\n", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Altrottstraße 31, Partner Port SAP");
        expect(parsedAddress.locality).toBe("Walldorf/Baden");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("69190");
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address on one line", () => {
        const parsedAddress = new Address("ABC-Strasse 19, 20354 Hamburg, Deutschland", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("ABC-Strasse 19");
        expect(parsedAddress.locality).toBe("Hamburg");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("20354");
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address with superfluous whitespace", () => {
        const parsedAddress = new Address("\t\t\tAltrottstraße 31\n\n\nPartner Port SAP\n   \t\n69190   \r\t\n Walldorf/Baden\n   \t \t \t Deutschland\n\n\n", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Altrottstraße 31, Partner Port SAP");
        expect(parsedAddress.locality).toBe("Walldorf/Baden");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("69190");
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address without delimiters", () => {
        const parsedAddress = new Address("ABC-Strasse 19 20354 Hamburg Deutschland", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("ABC-Strasse 19");
        expect(parsedAddress.locality).toBe("Hamburg");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("20354");
        expect(parsedAddress.country).toBe("Deutschland");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address with special characters", () => {
        const parsedAddress = new Address("Geschäftsstelle Lützowplatz 15\n(Eingang Einemstraße 24)\n10785 Würtzheim", {locale: "de-DE"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Geschäftsstelle Lützowplatz 15, (Eingang Einemstraße 24)");
        expect(parsedAddress.locality).toBe("Würtzheim");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("10785");
        expect(parsedAddress.country).toBeUndefined();
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should parse German address from US locale with English country name", () => {
        const parsedAddress = new Address("Dienerstrasse 12\n80331 Munich\nGermany", {locale: "en-US"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("Dienerstrasse 12");
        expect(parsedAddress.locality).toBe("Munich");
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.postalCode).toBe("80331");
        expect(parsedAddress.country).toBe("Germany");
        expect(parsedAddress.countryCode).toBe("DE");
    });

    test("should format German address correctly", () => {
        const parsedAddress = new Address({
            streetAddress: "Dienerstrasse 12",
            locality: "München",
            postalCode: "80331",
            country: "Deutschland",
            countryCode: "DE"
        }, {locale: "de-DE"});
        const expected = "Dienerstrasse 12\n80331 München\nDeutschland";
        const formatter = new AddressFmt({locale: "de-DE"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test("should format German address from US locale", () => {
        const parsedAddress = new Address({
            streetAddress: "Dienerstrasse 12",
            locality: "Munich",
            postalCode: "80331",
            country: "Germany",
            countryCode: "DE"
        }, {locale: "en-US"});
        const expected = "Dienerstrasse 12\n80331 Munich\nGermany";
        const formatter = new AddressFmt({locale: "en-US"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
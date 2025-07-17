/*
 * address_VN.test.js - Vietnam address parsing and formatting tests for ilib-address
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

describe("Vietnam address parsing and formatting", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("vi-VN");
        }
    });

    test("should parse a normal Vietnam address with all components", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612\nViệt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address without postal code", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3 Ho Chi Minh City\nViệt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
        expect(parsedAddress.postalCode).toBeUndefined();
    });

    test("should parse Vietnam address without country", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBeUndefined();
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address with many lines", () => {
        const parsedAddress = new Address("No.123/45\nđường Nguyễn Thị Minh Khai\nPhường 5\nQuận 3\nHo Chi Minh City\n705612\nViệt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address on one line", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612, Việt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address with superfluous whitespace", () => {
        const parsedAddress = new Address("No.123/45\n\nđường Nguyễn\t\tThị Minh Khai\n\n\tPhường 5\n\t\t\rQuận 3\r\r\n\tHo Chi Minh City\n\n\t705612\n\n\t\rViệt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address without delimiters", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612, Việt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should parse Vietnam address from US locale", () => {
        const parsedAddress = new Address("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612\nViệt Nam", {locale: "vi-VN"});
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe("No.123/45, đường Nguyễn Thị Minh Khai, Phường 5");
        expect(parsedAddress.locality).toBe("Quận 3");
        expect(parsedAddress.region).toBe("Ho Chi Minh City");
        expect(parsedAddress.postalCode).toBe("705612");
        expect(parsedAddress.country).toBe("Việt Nam");
        expect(parsedAddress.countryCode).toBe("VN");
    });

    test("should format Vietnam address in native locale", () => {
        const parsedAddress = new Address({
            streetAddress: "No.123/45, đường Nguyễn Thị Minh Khai, Phường 5",
            locality: "Quận 3",
            postalCode: "705612",
            region: "Ho Chi Minh City",
            country: "Việt Nam",
            countryCode: "VN"
        }, {locale: "vi-VN"});
        const expected = "No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612\nViệt Nam";
        const formatter = new AddressFmt({locale: "vi-VN"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test("should format Vietnam address from US locale", () => {
        const parsedAddress = new Address({
            streetAddress: "No.123/45, đường Nguyễn Thị Minh Khai, Phường 5",
            locality: "Quận 3",
            postalCode: "705612",
            region: "Ho Chi Minh City",
            country: "Việt Nam",
            countryCode: "VN"
        }, {locale: "en-US"});
        const expected = "No.123/45, đường Nguyễn Thị Minh Khai, Phường 5, Quận 3, Ho Chi Minh City, 705612\nViệt Nam";
        const formatter = new AddressFmt({locale: "en-US"});
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 
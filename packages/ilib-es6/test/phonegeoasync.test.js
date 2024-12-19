/*
 * phonegeoasync.test.js - Test the GeoLocator Object.
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import PhoneNumber from "../src/PhoneNumber.js";
import PhoneGeoLocator from "../src/PhoneGeoLocator.js";

describe("testphonegeoasync", () => {
    test("PhoneGeoAsyncNANP", () => {
        expect.assertions(6);
        new PhoneNumber("+1 650 654 3210", {
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "North America",
                                ln: "North America and the Caribbean Islands",
                                code: "US"
                            },
                            area: {
                                sn: "California",
                                ln: "Central California: San Mateo, Palo Alto, Redwood City, Menlo Park, Mountain View, southern San Francisco suburbs"
                            }
                        };
                        expect(typeof(locator) !== "undefined").toBeTruthy();

                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });
    });

    test("PhoneGeoAsyncNANPOtherLocale", () => {
        expect.assertions(6);
        new PhoneNumber("+1 650 654 3210", {
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    locale: 'fr-FR',
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "Amérique du Nord",
                                ln: "Amérique du Nord et Îles Caraïbes",
                                code: "US"
                            },
                            area: {
                                sn: "Californie",
                                ln: "Californie centrale : San Mateo, Palo Alto, Redwood City, Menlo Park, Mountain View, banlieues du sud de San Francisco"
                            }
                        };

                        expect(typeof(locator) !== "undefined").toBeTruthy();
                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });
    });

    //for bug NOV-118981
    test("PhoneGeoAsyncNANPInvalidNumber", () => {
        expect.assertions(6);
        new PhoneNumber("1 234", {
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    locale: 'en-US',
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "North America",
                                ln: "North America and the Caribbean Islands",
                                code: "US"
                            },
                            area: {
                                sn: "Ohio",
                                ln: "Ohio"
                            }
                        };

                        expect(typeof(locator) !== "undefined").toBeTruthy();
                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });

    });

    test("PhoneGeoAsyncDefaultDE", () => {
        expect.assertions(6);
        new PhoneNumber("06224 123456", {
            locale: "de-DE",
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    locale: 'de-DE',
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "Deutschland",
                                ln: "Deutschland",
                                code: "DE"
                            },
                            area: {
                                sn: "Leimen",
                                ln: "Leimen, Nußloch, Sandhausen"
                            }
                        };

                        expect(typeof(locator) !== "undefined").toBeTruthy();
                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });
    });

    test("PhoneGeoAsyncDEMobileNumber", () => {
        expect.assertions(6);
        new PhoneNumber("017 12345678", {
            locale: "de-DE",
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    locale: 'de-DE',
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "Deutschland",
                                ln: "Deutschland",
                                code: "DE"
                            },
                            area: {
                                sn: "Handynummer",
                                ln: "Handynummer"
                            }
                        };

                        expect(typeof(locator) !== "undefined").toBeTruthy();
                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });
    });

    test("PhoneGeoAsyncDefaultHK", () => {
        expect.assertions(6);
        new PhoneNumber("0663 12345678", {
            locale: 'en-CN',
            sync: false,
            onLoad: parsed => {
                new PhoneGeoLocator({
                    locale: 'zh-HK',
                    mcc: "460",
                    sync: false,
                    onLoad: locator => {
                        const expected = {
                            country: {
                                sn: "中国",
                                ln: "中华人民共和国",
                                code: "CN"
                            },
                            area: {
                                sn: "揭阳市",
                                ln: "揭阳市"
                            }
                        };

                        // give the prc mcc number so that this gives the right geo location
                        expect(typeof(locator) !== "undefined").toBeTruthy();
                        const geoInfo = locator.locate(parsed);

                        expect(geoInfo.country.code).toBe(expected.country.code);
                        expect(geoInfo.country.sn).toBe(expected.country.sn);
                        expect(geoInfo.country.ln).toBe(expected.country.ln);
                        expect(geoInfo.area.sn).toBe(expected.area.sn);
                        expect(geoInfo.area.ln).toBe(expected.area.ln);
                    }
                });
            }
        });
    });
});

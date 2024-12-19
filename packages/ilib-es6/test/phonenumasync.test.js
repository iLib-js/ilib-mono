/*
 * phonenumasync.test.js - test phonenumber class
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

describe("testphonenumasync", () => {
    test("PhoneParseAsyncAUFull", () => {
        expect.assertions(2);
        new PhoneNumber("(08) 1234 5678", {
            locale: "en-AU",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) !== "undefined").toBeTruthy();

                new PhoneNumber({
                    trunkAccess: "0",
                    areaCode: "8",
                    subscriberNumber: "12345678"
                }, {
                    locale: "en-AU",
                    sync: false,
                    onLoad: expected => {
                        expect(parsed.equals(expected)).toBeTruthy();
                    }
                });
            }
        });
    });

    test("PhoneParseAsyncHKFromIntl", () => {
        expect.assertions(2);
        new PhoneNumber("+85223897077", {
            locale: "en-HK",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) !== "undefined").toBeTruthy();

                new PhoneNumber({
                    iddPrefix: "+",
                    countryCode: "852",
                    subscriberNumber: "23897077"
                }, {
                    locale: "en-HK",
                    sync: false,
                    onLoad: expected => {
                        expect(parsed.equals(expected)).toBeTruthy();
                    }
                });
            }
        });
    });

    test("PhoneParseAsyncUSFull", () => {
        expect.assertions(2);
        new PhoneNumber("(456) 345-3434", {
            locale: "en-US",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) !== "undefined").toBeTruthy();

                new PhoneNumber({
                    areaCode: "456",
                    subscriberNumber: "3453434"
                }, {
                    locale: "en-US",
                    sync: false,
                    onLoad: expected => {
                        expect(parsed.equals(expected)).toBeTruthy();
                    }
                });
            }
        });
    });

    test("PhoneParseAsyncKRFullLongAreaCode", () => {
        expect.assertions(2);
        new PhoneNumber("033-9467-2345", {
            locale: "ko-KR",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) !== "undefined").toBeTruthy();

                new PhoneNumber({
                    trunkAccess: "0",
                    areaCode: "33",
                    subscriberNumber: "94672345"
                }, {
                    locale: "ko-KR",
                    sync: false,
                    onLoad: expected => {
                        expect(parsed.equals(expected)).toBeTruthy();
                    }
                });
            }
        });
    });

    test("PhoneParseAsyncMXFull", () => {
        expect.assertions(2);
        new PhoneNumber("6241234567", {
            locale: "es-MX",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) !== "undefined").toBeTruthy();

                new PhoneNumber({
                    areaCode: "624",
                    subscriberNumber: "1234567"
                }, {
                    locale: "es-MX",
                    sync: false,
                    onLoad: expected => {
                        expect(parsed.equals(expected)).toBeTruthy();
                    }
                });
            }
        });
    });

    test("PhoneParseAsyncUndefined", () => {
        expect.assertions(1);
        new PhoneNumber(undefined, {
            locale: "en-AU",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) === "undefined").toBeTruthy();
            }
        });
    });

    test("PhoneParseAsyncEmpty", () => {
        expect.assertions(1);
        new PhoneNumber("", {
            locale: "en-AU",
            sync: false,
            onLoad: parsed => {
                expect(typeof(parsed) === "undefined").toBeTruthy();
            }
        });
    });
});
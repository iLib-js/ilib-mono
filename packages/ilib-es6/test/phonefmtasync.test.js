/*
 * phonefmtasync.test.js - Test the phonefmt
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
import PhoneFmt from "../src/PhoneFmt.js";

describe("testphonefmtasync", () => {
    test("FormatAsyncUSNoLocale", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
            areaCode: "456",
            subscriberNumber: "3453434"
        }, {
            sync: false,
            onLoad: parsed => {
                // default to US format
                new PhoneFmt({
                    style: "default",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "(456) 345-3434";
                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncUSPlusIDDtoUnknownCountry", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
            iddPrefix: "+",
            countryCode: "506",    // costa rica
            subscriberNumber: "87654321"
        }, {
            sync: false,
            onLoad: parsed => {
                // default to US format
                new PhoneFmt({
                    locale: "en-US",
                    style: "dashes",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "+506 87654321";    // use last resort rule for subscriber number

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncUSStyle0Emergency", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
            emergency: "911"
        }, {
            sync: false,
            onLoad: parsed => {
                // default to US format
                new PhoneFmt({
                    locale: "en-US",
                    style: "default",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "911 ";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncUSNumberWithFRMCC", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
            trunkAccess: "0",
            areaCode: "6",
            subscriberNumber: "15987654"
        }, {
            sync: false,
            onLoad: parsed => {
                // default to US format
                new PhoneFmt({
                    locale: "en-US",
                    style: "default",
                    mcc: "208",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "06 15 98 76 54";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncWithParamsFormatUSInternational", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
            iddPrefix: "+",
            countryCode: "33",
            areaCode: "1",
            subscriberNumber: "12345678"
        }, {
            locale: "en-US",
            sync: false,
            onLoad: parsed => {
                new PhoneFmt({
                    locale: "en-US",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "+33 1 12 34 56 78";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncGBLongAreaCode", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
                trunkAccess: "0",
                areaCode: "17684",
                subscriberNumber: "12345"
        }, {
            locale: "en-GB",
            sync: false,
            onLoad: parsed => {
                new PhoneFmt({
                    locale: "en-GB",
                    style: "default",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "(0176 84) 12345";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });


    });

    test("FormatAsyncDEStyle1", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber({
                trunkAccess: "0",
                areaCode: "6224",
                subscriberNumber: "1234567"
        }, {
            locale: "de-DE",
            sync: false,
            onLoad: parsed => {
                new PhoneFmt({
                    locale: "de-DE",
                    style: "alten",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "06224/1 23 45 67";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });
                    }
                });
            }
        });
    });

    test("FormatAsyncJPStyle1", () => {
        expect.assertions(1);
        let formatted;
        new PhoneNumber("0668795111", {
            locale: "ja-JP",
            sync: false,
            onLoad: parsed => {
                new PhoneFmt({
                    locale: "ja-JP",
                    style: "default",
                    sync: false,
                    onLoad: fmt => {
                        const expected = "06-6879-5111";

                        fmt.format(parsed, {
                            sync: false,
                            onLoad: formatted => {
                                expect(formatted).toBe(expected);
                            }
                        });

                    }
                });
            }
        });
    });
});

/*
 * testphonegeoasync.js - Test the GeoLocator Object.
 *
 * Copyright © 2018, JEDLSoft
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

import PhoneNumber from "../lib/PhoneNumber.js";
import PhoneGeoLocator from "../lib/PhoneGeoLocator.js";

module.exports.phonegeopromise = {
    testPhoneGeoAsyncNANP: function(test) {
        test.expect(6);
        PhoneNumber.create("+1 650 654 3210", {
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                sync: false
            }).then(function(locator) {
                var expected = {
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
                test.ok(typeof(locator) !== "undefined");

                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });
    },

    testPhoneGeoAsyncNANPOtherLocale: function(test) {
        test.expect(6);
        PhoneNumber.create("+1 650 654 3210", {
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                locale: 'fr-FR',
                sync: false
            }).then(function(locator) {
                var expected = {
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

                test.ok(typeof(locator) !== "undefined");
                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });
    },

//  for bug NOV-118981
    testPhoneGeoAsyncNANPInvalidNumber: function(test) {
        test.expect(6);
        PhoneNumber.create("1 234", {
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                locale: 'en-US',
                sync: false
            }).then(function(locator) {
                var expected = {
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

                test.ok(typeof(locator) !== "undefined");
                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });

    },

    testPhoneGeoAsyncDefaultDE: function(test) {
        test.expect(6);
        PhoneNumber.create("06224 123456", {
            locale: "de-DE",
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                locale: 'de-DE',
                sync: false
            }).then(function(locator) {
                var expected = {
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

                test.ok(typeof(locator) !== "undefined");
                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });
    },

    testPhoneGeoAsyncDEMobileNumber: function(test) {
        test.expect(6);
        PhoneNumber.create("017 12345678", {
            locale: "de-DE",
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                locale: 'de-DE',
                sync: false
            }).then(function(locator) {
                var expected = {
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

                test.ok(typeof(locator) !== "undefined");
                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });
    },

    testPhoneGeoAsyncDefaultHK: function(test) {
        test.expect(6);
        PhoneNumber.create("0663 12345678", {
            locale: 'en-CN',
            sync: false
        }).then(function(parsed) {
            PhoneGeoLocator.create({
                locale: 'zh-HK',
                mcc: "460",
                sync: false
            }).then(function(locator) {
                var expected = {
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
                test.ok(typeof(locator) !== "undefined");
                var geoInfo = locator.locate(parsed);

                test.equal(geoInfo.country.code, expected.country.code);
                test.equal(geoInfo.country.sn, expected.country.sn);
                test.equal(geoInfo.country.ln, expected.country.ln);
                test.equal(geoInfo.area.sn, expected.area.sn);
                test.equal(geoInfo.area.ln, expected.area.ln);
                test.done();
            });
        });
    }
};

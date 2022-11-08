/*
 * testaddress.js - test the address parsing and formatting routines
 *
 * Copyright © 2013-2015, 2017, 2022 JEDLSoft
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

function searchRegions(array, regionCode) {
    return array.find((region) => {
        return region.code === regionCode;
    });
}

let setUpPerformed = false;

export const testformatinfo = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            let promise = Promise.resolve(true);
            ["en-CA", "en-GB", "en-HK", "en-JP", "en-QQ", "en-SG", "en-US", "en-XY", "de-DE", "ja-JP", "ru-RU", "zh-Hans-CN", "zh-Hans-SG", "zxx-XX"].forEach(locale => {
                promise = promise.then(() => {
                    return LocaleData.ensureLocale(locale);
                });
            });
            promise.then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testAddressFmtGetFormatInfoUSRightComponents: function(test) {
        test.expect(15);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 3);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Street Address");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "City");
            test.equal(info[1][1].component, "region");
            test.equal(info[1][1].label, "State");
            test.equal(info[1][2].component, "postalCode");
            test.equal(info[1][2].label, "Zip Code");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Country");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoUSRightConstraints: function(test) {
        test.expect(19);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            test.equal(info[1][2].component, "postalCode");
            test.equal(info[1][2].constraint, "[0-9]{5}(-[0-9]{4})?");

            test.equal(info[1][1].component, "region");
            test.ok(info[1][1].constraint);
            var r = searchRegions(info[1][1].constraint, "AZ");
            test.equal(r.code, "AZ");
            test.equal(r.name, "Arizona");
            r = searchRegions(info[1][1].constraint, "MS");
            test.equal(r.code, "MS");
            test.equal(r.name, "Mississippi");
            r = searchRegions(info[1][1].constraint, "NY");
            test.equal(r.code, "NY");
            test.equal(r.name, "New York");

            test.equal(info[2][0].component, "country");
            test.ok(info[2][0].constraint);
            var r = searchRegions(info[2][0].constraint, "JP");
            test.equal(r.code, "JP");
            test.equal(r.name, "Japan");
            r = searchRegions(info[2][0].constraint, "CR");
            test.equal(r.code, "CR");
            test.equal(r.name, "Costa Rica");
            r = searchRegions(info[2][0].constraint, "ZA");
            test.equal(r.code, "ZA");
            test.equal(r.name, "South Africa");

            test.done();
        });
    },

    testAddressFmtGetFormatInfoUSButGermanLabels: function(test) {
        test.expect(15);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo("de").then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 3);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Straßenadresse");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "Stadt");
            test.equal(info[1][1].component, "region");
            test.equal(info[1][1].label, "Bundesland");
            test.equal(info[1][2].component, "postalCode");
            test.equal(info[1][2].label, "Postleitzahl");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Land");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoDE: function(test) {
        test.expect(21);
        var formatter = new AddressFmt({locale: 'de-DE'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 2);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Straßenadresse");
            test.equal(info[1][0].component, "postalCode");
            test.equal(info[1][0].label, "Postleitzahl");
            test.equal(info[1][0].constraint, "[0-9]{5}");
            test.equal(info[1][1].component, "locality");
            test.equal(info[1][1].label, "Stadt");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Land");
            test.ok(info[2][0].constraint);
            var r = searchRegions(info[2][0].constraint, "RU");
            test.equal(r.code, "RU");
            test.equal(r.name, "Russland");
            r = searchRegions(info[2][0].constraint, "CA");
            test.equal(r.code, "CA");
            test.equal(r.name, "Kanada");
            r = searchRegions(info[2][0].constraint, "ZA");
            test.equal(r.code, "ZA");
            test.equal(r.name, "Südafrika");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoCN: function(test) {
        test.expect(24);
        var formatter = new AddressFmt({locale: 'zh-Hans-CN'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 4);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 1);
            test.equal(info[2].length, 2);
            test.equal(info[3].length, 1);

            test.equal(info[0][0].component, "country");
            test.equal(info[0][0].label, "国家/地区");
            test.ok(info[0][0].constraint);
            var r = searchRegions(info[0][0].constraint, "RU");
            test.equal(r.code, "RU");
            test.equal(r.name, "俄罗斯");
            r = searchRegions(info[0][0].constraint, "CA");
            test.equal(r.code, "CA");
            test.equal(r.name, "加拿大");
            r = searchRegions(info[0][0].constraint, "ZA");
            test.equal(r.code, "ZA");
            test.equal(r.name, "南非");
            test.equal(info[1][0].component, "region");
            test.equal(info[1][0].label, "省或地区");
            test.equal(info[2][0].component, "locality");
            test.equal(info[2][0].label, "城市");
            test.equal(info[2][1].component, "postalCode");
            test.equal(info[2][1].label, "邮政编码");
            test.equal(info[2][1].constraint, "[0-9]{6}$");
            test.equal(info[3][0].component, "streetAddress");
            test.equal(info[3][0].label, "地址");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoSG: function(test) {
        test.expect(20);
        var formatter = new AddressFmt({locale: 'zh-Hans-SG'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 2);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 3);

            test.equal(info[0][0].component, "country");
            test.equal(info[0][0].label, "国家/地区");
            test.ok(info[0][0].constraint);
            var r = searchRegions(info[0][0].constraint, "RU");
            test.equal(r.code, "RU");
            test.equal(r.name, "俄罗斯");
            r = searchRegions(info[0][0].constraint, "CA");
            test.equal(r.code, "CA");
            test.equal(r.name, "加拿大");
            r = searchRegions(info[0][0].constraint, "ZA");
            test.equal(r.code, "ZA");
            test.equal(r.name, "南非");
            test.equal(info[1][0].component, "postalCode");
            test.equal(info[1][0].label, "邮政编码");
            test.equal(info[1][0].constraint, "^[0-9]{6}");
            test.equal(info[1][1].component, "locality");
            test.equal(info[1][1].label, "镇");
            test.equal(info[1][2].component, "streetAddress");
            test.equal(info[1][2].label, "地址");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoENSG: function(test) {
        test.expect(21);
        var formatter = new AddressFmt({locale: 'en-SG'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 2);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Street Address");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "Town");
            test.equal(info[1][1].component, "postalCode");
            test.equal(info[1][1].label, "Post Code");
            test.equal(info[1][1].constraint, "[0-9]{6}");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Country");
            test.ok(info[2][0].constraint);

            var r = searchRegions(info[2][0].constraint, "RU");
            test.equal(r.code, "RU");
            test.equal(r.name, "Russia");
            r = searchRegions(info[2][0].constraint, "CA");
            test.equal(r.code, "CA");
            test.equal(r.name, "Canada");
            r = searchRegions(info[2][0].constraint, "ZA");
            test.equal(r.code, "ZA");
            test.equal(r.name, "South Africa");

            test.done();
        });
    },

    testAddressFmtGetFormatInfoCARightComponents: function(test) {
        test.expect(23);
        var formatter = new AddressFmt({locale: 'en-CA'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 3);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Street address");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "City");
            test.equal(info[1][1].component, "region");
            test.equal(info[1][1].label, "Province or territory");
            test.ok(info[1][1].constraint);
            var r = searchRegions(info[1][1].constraint, "NT");
            test.equal(r.code, "NT");
            test.equal(r.name, "Northwest Territories");
            r = searchRegions(info[1][1].constraint, "BC");
            test.equal(r.code, "BC");
            test.equal(r.name, "British Columbia");
            r = searchRegions(info[1][1].constraint, "QC");
            test.equal(r.code, "QC");
            test.equal(r.name, "Quebec");
            test.equal(info[1][2].component, "postalCode");
            test.equal(info[1][2].label, "Postal code");
            test.equal(info[1][2].constraint, "[A-Za-z][0-9][A-Za-z]\\s+[0-9][A-Za-z][0-9]");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Country");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoCAInGerman: function(test) {
        test.expect(23);
        var formatter = new AddressFmt({locale: 'en-CA'});

        formatter.getFormatInfo("de").then((info) => {
            test.ok(info);
            test.equal(info.length, 3);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 3);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Straßenadresse");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "Stadt");
            test.equal(info[1][1].component, "region");
            test.equal(info[1][1].label, "Provinz oder Gebiet");
            test.equal(info[1][2].component, "postalCode");
            test.ok(info[1][1].constraint);
            var r = searchRegions(info[1][1].constraint, "NT");
            test.equal(r.code, "NT");
            test.equal(r.name, "Nordwest-Territorien");
            r = searchRegions(info[1][1].constraint, "BC");
            test.equal(r.code, "BC");
            test.equal(r.name, "British Columbia");
            r = searchRegions(info[1][1].constraint, "QC");
            test.equal(r.code, "QC");
            test.equal(r.name, "Québec");
            test.equal(info[1][2].label, "Postleitzahl");
            test.equal(info[1][2].constraint, "[A-Za-z][0-9][A-Za-z]\\s+[0-9][A-Za-z][0-9]");
            test.equal(info[2][0].component, "country");
            test.equal(info[2][0].label, "Land");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoGBRightComponents: function(test) {
        test.expect(15);
        var formatter = new AddressFmt({locale: 'en-GB'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            test.equal(info.length, 4);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 1);
            test.equal(info[2].length, 1);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Street address");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "Town");
            test.equal(info[2][0].component, "postalCode");
            test.equal(info[2][0].label, "Post code");
            test.equal(info[2][0].constraint, "([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            test.equal(info[3][0].component, "country");
            test.equal(info[3][0].label, "Country");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoUSRightSortOrder: function(test) {
        test.expect(61);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            var expectedOrder = [
                "Alabama",
                "Alaska",
                "American Samoa",
                "Arizona",
                "Arkansas",
                "California",
                "Colorado",
                "Connecticut",
                "Delaware",
                "Florida",
                "Georgia",
                "Guam",
                "Hawaii",
                "Idaho",
                "Illinois",
                "Indiana",
                "Iowa",
                "Kansas",
                "Kentucky",
                "Louisiana",
                "Maine",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana",
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota",
                "Northern Mariana Islands",
                "Ohio",
                "Oklahoma",
                "Oregon",
                "Pennsylvania",
                "Puerto Rico",
                "Rhode Island",
                "South Carolina",
                "South Dakota",
                "Tennessee",
                "Texas",
                "U.S. Outlying Islands",
                "U.S. Virgin Islands",
                "Utah",
                "Vermont",
                "Virginia",
                "Washington",
                "Washington DC",
                "West Virginia",
                "Wisconsin",
                "Wyoming"
            ];

            test.equal(info[1][1].component, "region");
            test.ok(info[1][1].constraint);
            test.equal(info[1][1].constraint.length, expectedOrder.length);

            for (var i = 0; i < expectedOrder.length; i++) {
                test.equal(info[1][1].constraint[i].name, expectedOrder[i]);
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoUSRightSortOrderInSpanish: function(test) {
        test.expect(61);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo("es").then((info) => {
            test.ok(info);
            var expectedOrder = [
                "Alabama",
                "Alaska",
                "American Samoa",
                "Arizona",
                "Arkansas",
                "California",
                "Carolina del Norte",
                "Carolina del Sur",
                "Colorado",
                "Connecticut",
                "Dakota del Norte",
                "Dakota del Sur",
                "Delaware",
                "Florida",
                "Georgia",
                "Guam",
                "Hawái",
                "Idaho",
                "Illinois",
                "Indiana",
                "Iowa",
                "Kansas",
                "Kentucky",
                "Luisiana",
                "Maine",
                "Maryland",
                "Massachusetts",
                "Míchigan",
                "Minnesota",
                "Misisipi",
                "Misuri",
                "Montana",
                "Nebraska",
                "Nevada",
                "Northern Mariana Islands",
                "Nueva Jersey",
                "Nueva York",
                "Nuevo Hampshire",
                "Nuevo México",
                "Ohio",
                "Oklahoma",
                "Oregón",
                "Pensilvania",
                "Puerto Rico",
                "Rhode Island",
                "Tennessee",
                "Texas",
                "U.S. Outlying Islands",
                "U.S. Virgin Islands",
                "Utah",
                "Vermont",
                "Virginia",
                "Virginia Occidental",
                "Washington",
                "Washington D. C.",
                "Wisconsin",
                "Wyoming"
            ];

            test.equal(info[1][1].component, "region");
            test.ok(info[1][1].constraint);
            test.equal(info[1][1].constraint.length, expectedOrder.length);

            for (var i = 0; i < expectedOrder.length; i++) {
                test.equal(info[1][1].constraint[i].name, expectedOrder[i]);
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoENCountriesRightSortOrder: function(test) {
        test.expect(262);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);
            var expectedOrder = [
                "Afghanistan",
                "Åland Islands",
                "Albania",
                "Algeria",
                "American Samoa",
                "Andorra",
                "Angola",
                "Anguilla",
                "Antigua & Barbuda",
                "Argentina",
                "Armenia",
                "Aruba",
                "Ascension Island",
                "Australia",
                "Austria",
                "Azerbaijan",
                "Bahamas",
                "Bahrain",
                "Bangladesh",
                "Barbados",
                "Belarus",
                "Belgium",
                "Belize",
                "Benin",
                "Bermuda",
                "Bhutan",
                "Bolivia",
                "Bosnia & Herzegovina",
                "Botswana",
                "Bouvet Island",
                "Brazil",
                "British Indian Ocean Territory",
                "British Virgin Islands",
                "Brunei",
                "Bulgaria",
                "Burkina Faso",
                "Burundi",
                "Cambodia",
                "Cameroon",
                "Canada",
                "Canary Islands",
                "Cape Verde",
                "Caribbean Netherlands",
                "Cayman Islands",
                "Central African Republic",
                "Ceuta & Melilla",
                "Chad",
                "Chile",
                "China",
                "Christmas Island",
                "Clipperton Island",
                "Cocos (Keeling) Islands",
                "Colombia",
                "Comoros",
                "Congo - Brazzaville",
                "Congo - Kinshasa",
                "Cook Islands",
                "Costa Rica",
                "Côte d’Ivoire",
                "Croatia",
                "Cuba",
                "Curaçao",
                "Cyprus",
                "Czechia",
                "Denmark",
                "Diego Garcia",
                "Djibouti",
                "Dominica",
                "Dominican Republic",
                "Ecuador",
                "Egypt",
                "El Salvador",
                "Equatorial Guinea",
                "Eritrea",
                "Estonia",
                "Eswatini",
                "Ethiopia",
                "Falkland Islands",
                "Faroe Islands",
                "Fiji",
                "Finland",
                "France",
                "French Guiana",
                "French Polynesia",
                "French Southern Territories",
                "Gabon",
                "Gambia",
                "Georgia",
                "Germany",
                "Ghana",
                "Gibraltar",
                "Greece",
                "Greenland",
                "Grenada",
                "Guadeloupe",
                "Guam",
                "Guatemala",
                "Guernsey",
                "Guinea",
                "Guinea-Bissau",
                "Guyana",
                "Haiti",
                "Heard & McDonald Islands",
                "Honduras",
                "Hong Kong SAR China",
                "Hungary",
                "Iceland",
                "India",
                "Indonesia",
                "Iran",
                "Iraq",
                "Ireland",
                "Isle of Man",
                "Israel",
                "Italy",
                "Jamaica",
                "Japan",
                "Jersey",
                "Jordan",
                "Kazakhstan",
                "Kenya",
                "Kiribati",
                "Kosovo",
                "Kuwait",
                "Kyrgyzstan",
                "Laos",
                "Latvia",
                "Lebanon",
                "Lesotho",
                "Liberia",
                "Libya",
                "Liechtenstein",
                "Lithuania",
                "Luxembourg",
                "Macao SAR China",
                "Madagascar",
                "Malawi",
                "Malaysia",
                "Maldives",
                "Mali",
                "Malta",
                "Marshall Islands",
                "Martinique",
                "Mauritania",
                "Mauritius",
                "Mayotte",
                "Mexico",
                "Micronesia",
                "Moldova",
                "Monaco",
                "Mongolia",
                "Montenegro",
                "Montserrat",
                "Morocco",
                "Mozambique",
                "Myanmar (Burma)",
                "Namibia",
                "Nauru",
                "Nepal",
                "Netherlands",
                "New Caledonia",
                "New Zealand",
                "Nicaragua",
                "Niger",
                "Nigeria",
                "Niue",
                "Norfolk Island",
                "North Korea",
                "North Macedonia",
                "Northern Mariana Islands",
                "Norway",
                "Oman",
                "Outlying Oceania",
                "Pakistan",
                "Palau",
                "Palestinian Territories",
                "Panama",
                "Papua New Guinea",
                "Paraguay",
                "Peru",
                "Philippines",
                "Pitcairn Islands",
                "Poland",
                "Portugal",
                "Pseudo-Accents",
                "Pseudo-Bidi",
                "Puerto Rico",
                "Qatar",
                "Réunion",
                "Romania",
                "Russia",
                "Rwanda",
                "Samoa",
                "San Marino",
                "São Tomé & Príncipe",
                "Saudi Arabia",
                "Senegal",
                "Serbia",
                "Seychelles",
                "Sierra Leone",
                "Singapore",
                "Sint Maarten",
                "Slovakia",
                "Slovenia",
                "Solomon Islands",
                "Somalia",
                "South Africa",
                "South Georgia & South Sandwich Islands",
                "South Korea",
                "South Sudan",
                "Spain",
                "Sri Lanka",
                "St. Barthélemy",
                "St. Helena",
                "St. Kitts & Nevis",
                "St. Lucia",
                "St. Martin",
                "St. Pierre & Miquelon",
                "St. Vincent & Grenadines",
                "Sudan",
                "Suriname",
                "Svalbard & Jan Mayen",
                "Sweden",
                "Switzerland",
                "Syria",
                "Taiwan",
                "Tajikistan",
                "Tanzania",
                "Thailand",
                "Timor-Leste",
                "Togo",
                "Tokelau",
                "Tonga",
                "Trinidad & Tobago",
                "Tristan da Cunha",
                "Tunisia",
                "Turkey",
                "Turkmenistan",
                "Turks & Caicos Islands",
                "Tuvalu",
                "U.S. Outlying Islands",
                "U.S. Virgin Islands",
                "Uganda",
                "Ukraine",
                "United Arab Emirates",
                "United Kingdom",
                "United States",
                "Uruguay",
                "Uzbekistan",
                "Vanuatu",
                "Vatican City",
                "Venezuela",
                "Vietnam",
                "Wallis & Futuna",
                "Western Sahara",
                "Yemen",
                "Zambia",
                "Zimbabwe"
            ];

            test.equal(info[2][0].component, "country");
            test.ok(info[2][0].constraint);
            test.equal(info[2][0].constraint.length, expectedOrder.length);

            for (var i = 0; i < expectedOrder.length; i++) {
                test.equal(info[2][0].constraint[i].name, expectedOrder[i]);
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoESCountriesRightSortOrder: function(test) {
        test.expect(262);
        var formatter = new AddressFmt({locale: 'en-US'});

        formatter.getFormatInfo("es").then((info) => {
            test.ok(info);
            var expectedOrder = [
                "Afganistán",
                "Albania",
                "Alemania",
                "Andorra",
                "Angola",
                "Anguila",
                "Antigua y Barbuda",
                "Arabia Saudí",
                "Argelia",
                "Argentina",
                "Armenia",
                "Aruba",
                "Australia",
                "Austria",
                "Azerbaiyán",
                "Bahamas",
                "Bangladés",
                "Barbados",
                "Baréin",
                "Bélgica",
                "Belice",
                "Benín",
                "Bermudas",
                "Bielorrusia",
                "Bolivia",
                "Bosnia y Herzegovina",
                "Botsuana",
                "Brasil",
                "Brunéi",
                "Bulgaria",
                "Burkina Faso",
                "Burundi",
                "Bután",
                "Cabo Verde",
                "Camboya",
                "Camerún",
                "Canadá",
                "Caribe neerlandés",
                "Catar",
                "Ceuta y Melilla",
                "Chad",
                "Chequia",
                "Chile",
                "China",
                "Chipre",
                "Ciudad del Vaticano",
                "Colombia",
                "Comoras",
                "Corea del Norte",
                "Corea del Sur",
                "Costa de Marfil",
                "Costa Rica",
                "Croacia",
                "Cuba",
                "Curazao",
                "Diego García",
                "Dinamarca",
                "Dominica",
                "Ecuador",
                "Egipto",
                "El Salvador",
                "Emiratos Árabes Unidos",
                "Eritrea",
                "Eslovaquia",
                "Eslovenia",
                "España",
                "Estados Unidos",
                "Estonia",
                "Esuatini",
                "Etiopía",
                "Filipinas",
                "Finlandia",
                "Fiyi",
                "Francia",
                "Gabón",
                "Gambia",
                "Georgia",
                "Ghana",
                "Gibraltar",
                "Granada",
                "Grecia",
                "Groenlandia",
                "Guadalupe",
                "Guam",
                "Guatemala",
                "Guayana Francesa",
                "Guernsey",
                "Guinea",
                "Guinea Ecuatorial",
                "Guinea-Bisáu",
                "Guyana",
                "Haití",
                "Honduras",
                "Hungría",
                "India",
                "Indonesia",
                "Irak",
                "Irán",
                "Irlanda",
                "Isla Bouvet",
                "Isla Clipperton",
                "Isla de la Ascensión",
                "Isla de Man",
                "Isla de Navidad",
                "Isla Norfolk",
                "Islandia",
                "Islas Åland",
                "Islas Caimán",
                "Islas Canarias",
                "Islas Cocos",
                "Islas Cook",
                "Islas Feroe",
                "Islas Georgia del Sur y Sandwich del Sur",
                "Islas Heard y McDonald",
                "Islas Malvinas",
                "Islas Marianas del Norte",
                "Islas Marshall",
                "Islas menores alejadas de EE. UU.",
                "Islas Pitcairn",
                "Islas Salomón",
                "Islas Turcas y Caicos",
                "Islas Vírgenes Británicas",
                "Islas Vírgenes de EE. UU.",
                "Israel",
                "Italia",
                "Jamaica",
                "Japón",
                "Jersey",
                "Jordania",
                "Kazajistán",
                "Kenia",
                "Kirguistán",
                "Kiribati",
                "Kosovo",
                "Kuwait",
                "Laos",
                "Lesoto",
                "Letonia",
                "Líbano",
                "Liberia",
                "Libia",
                "Liechtenstein",
                "Lituania",
                "Luxemburgo",
                "Macedonia del Norte",
                "Madagascar",
                "Malasia",
                "Malaui",
                "Maldivas",
                "Mali",
                "Malta",
                "Marruecos",
                "Martinica",
                "Mauricio",
                "Mauritania",
                "Mayotte",
                "México",
                "Micronesia",
                "Moldavia",
                "Mónaco",
                "Mongolia",
                "Montenegro",
                "Montserrat",
                "Mozambique",
                "Myanmar (Birmania)",
                "Namibia",
                "Nauru",
                "Nepal",
                "Nicaragua",
                "Níger",
                "Nigeria",
                "Niue",
                "Noruega",
                "Nueva Caledonia",
                "Nueva Zelanda",
                "Omán",
                "Países Bajos",
                "Pakistán",
                "Palaos",
                "Panamá",
                "Papúa Nueva Guinea",
                "Paraguay",
                "Perú",
                "Polinesia Francesa",
                "Polonia",
                "Portugal",
                "Pseudoacentos",
                "Pseudobidi",
                "Puerto Rico",
                "RAE de Hong Kong (China)",
                "RAE de Macao (China)",
                "Reino Unido",
                "República Centroafricana",
                "República del Congo",
                "República Democrática del Congo",
                "República Dominicana",
                "Reunión",
                "Ruanda",
                "Rumanía",
                "Rusia",
                "Sahara Occidental",
                "Samoa",
                "Samoa Americana",
                "San Bartolomé",
                "San Cristóbal y Nieves",
                "San Marino",
                "San Martín",
                "San Pedro y Miquelón",
                "San Vicente y las Granadinas",
                "Santa Elena",
                "Santa Lucía",
                "Santo Tomé y Príncipe",
                "Senegal",
                "Serbia",
                "Seychelles",
                "Sierra Leona",
                "Singapur",
                "Sint Maarten",
                "Siria",
                "Somalia",
                "Sri Lanka",
                "Sudáfrica",
                "Sudán",
                "Sudán del Sur",
                "Suecia",
                "Suiza",
                "Surinam",
                "Svalbard y Jan Mayen",
                "Tailandia",
                "Taiwán",
                "Tanzania",
                "Tayikistán",
                "Territorio Británico del Océano Índico",
                "Territorios alejados de Oceanía",
                "Territorios Australes Franceses",
                "Territorios Palestinos",
                "Timor-Leste",
                "Togo",
                "Tokelau",
                "Tonga",
                "Trinidad y Tobago",
                "Tristán de Acuña",
                "Túnez",
                "Turkmenistán",
                "Turquía",
                "Tuvalu",
                "Ucrania",
                "Uganda",
                "Uruguay",
                "Uzbekistán",
                "Vanuatu",
                "Venezuela",
                "Vietnam",
                "Wallis y Futuna",
                "Yemen",
                "Yibuti",
                "Zambia",
                "Zimbabue"
            ];

            test.equal(info[2][0].component, "country");
            test.ok(info[2][0].constraint);
            test.equal(info[2][0].constraint.length, expectedOrder.length);

            for (var i = 0; i < expectedOrder.length; i++) {
                test.equal(info[2][0].constraint[i].name, expectedOrder[i]);
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoGBWithTranslationsToRussian: function(test) {
        test.expect(15);
        var formatter = new AddressFmt({locale: 'en-GB'});

        formatter.getFormatInfo("ru").then((info) => {
            test.ok(info);
            test.equal(info.length, 4);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 1);
            test.equal(info[2].length, 1);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "Адрес");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "Город");
            test.equal(info[2][0].component, "postalCode");
            test.equal(info[2][0].label, "Почтовый индекс");
            test.equal(info[2][0].constraint, "([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            test.equal(info[3][0].component, "country");
            test.equal(info[3][0].label, "Страна");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoGBWithTranslationsToKorean: function(test) {
        test.expect(15);
        var formatter = new AddressFmt({locale: 'en-GB'});

        formatter.getFormatInfo("ko").then((info) => {
            test.ok(info);
            test.equal(info.length, 4);
            test.equal(info[0].length, 1);
            test.equal(info[1].length, 1);
            test.equal(info[2].length, 1);
            test.equal(info[2].length, 1);

            test.equal(info[0][0].component, "streetAddress");
            test.equal(info[0][0].label, "번지");
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "읍");
            test.equal(info[2][0].component, "postalCode");
            test.equal(info[2][0].label, "우편 번호");
            test.equal(info[2][0].constraint, "([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            test.equal(info[3][0].component, "country");
            test.equal(info[3][0].label, "국가");
            test.done();
        });
    },

    testAddressFmtGetFormatInfoUnknownCountry: function(test) {
        test.expect(10);
        var formatter = new AddressFmt({locale: 'en-XY'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            // test for generic root data
            test.equal(info[1][0].component, "locality");
            test.equal(info[1][0].label, "City");
            test.equal(info[1][0].constraint, "([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            test.equal(info[1][1].component, "region");
            test.equal(info[1][1].label, "Province");
            test.equal(info[1][1].constraint, "([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            test.equal(info[1][2].component, "postalCode");
            test.equal(info[1][2].label, "Postal Code");
            test.equal(info[1][2].constraint, "[0-9]+");

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameJA: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ja-JP'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j], "Prefecture");
                    }
                }
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameJA: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ja-JP'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j], "Prefecture");
                    }
                }
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameJA: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ja-JP'});

        formatter.getFormatInfo("en").then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j].label, "Prefecture");
                    }
                }
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameJATranslated: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ja-JP'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j].label, "都道府県");
                    }
                }
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameRU: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ru-RU'});

        formatter.getFormatInfo("en").then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j].label, "Oblast");
                    }
                }
            }

            test.done();
        });
    },

    testAddressFmtGetFormatInfoRightRegionNameRUTranslated: function(test) {
        test.expect(2);
        var formatter = new AddressFmt({locale: 'ru-RU'});

        formatter.getFormatInfo().then((info) => {
            test.ok(info);

            for (var i = 0; i < info.length; i++) {
                for (var j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        test.equal(info[i][j].label, "Область");
                    }
                }
            }

            test.done();
        });
    }
};
/*
 * formatinfo.test.js - test the address format info functionality
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

function searchRegions(array, regionCode) {
    return array.find((region) => {
        return region.code === regionCode;
    });
}

let setUpPerformed = false;

beforeAll(async () => {
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
        await promise;
    }
});

describe('Address Format Info', () => {
    describe('US Format Info', () => {
        test('should return correct US address components and labels', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(3);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Street Address");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("City");
            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("State");
            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].label).toBe("Zip Code");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Country");
        });

        test('should return correct US address constraints', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();

            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].constraint).toBe("[0-9]{5}(-[0-9]{4})?");

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].constraint).toBeTruthy();
            let r = searchRegions(info[1][1].constraint, "AZ");
            expect(r.code).toBe("AZ");
            expect(r.name).toBe("Arizona");
            r = searchRegions(info[1][1].constraint, "MS");
            expect(r.code).toBe("MS");
            expect(r.name).toBe("Mississippi");
            r = searchRegions(info[1][1].constraint, "NY");
            expect(r.code).toBe("NY");
            expect(r.name).toBe("New York");

            expect(info[2][0].component).toBe("country");
            expect(info[2][0].constraint).toBeTruthy();
            r = searchRegions(info[2][0].constraint, "JP");
            expect(r.code).toBe("JP");
            expect(r.name).toBe("Japan");
            r = searchRegions(info[2][0].constraint, "CR");
            expect(r.code).toBe("CR");
            expect(r.name).toBe("Costa Rica");
            r = searchRegions(info[2][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("South Africa");
        });

        test('should return US format info with German labels when requested', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo("de");

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(3);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Straßenadresse");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("Stadt");
            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("Bundesland");
            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].label).toBe("Postleitzahl");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Land");
        });

        test('should return US states in correct alphabetical order', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            const expectedOrder = [
                "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas",
                "California", "Colorado", "Connecticut", "Delaware", "Florida",
                "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana",
                "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
                "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
                "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
                "New Mexico", "New York", "North Carolina", "North Dakota",
                "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon",
                "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina",
                "South Dakota", "Tennessee", "Texas", "U.S. Outlying Islands",
                "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington",
                "Washington DC", "West Virginia", "Wisconsin", "Wyoming"
            ];

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].constraint).toBeTruthy();
            expect(info[1][1].constraint.length).toBe(expectedOrder.length);

            for (let i = 0; i < expectedOrder.length; i++) {
                expect(info[1][1].constraint[i].name).toBe(expectedOrder[i]);
            }
        });

        test('should return US states in Spanish when requested', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo("es");

            expect(info).toBeTruthy();
            const expectedOrder = [
                "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas",
                "California", "Carolina del Norte", "Carolina del Sur", "Colorado",
                "Connecticut", "Dakota del Norte", "Dakota del Sur", "Delaware",
                "Florida", "Georgia", "Guam", "Hawái", "Idaho", "Illinois",
                "Indiana", "Iowa", "Kansas", "Kentucky", "Luisiana", "Maine",
                "Maryland", "Massachusetts", "Míchigan", "Minnesota", "Misisipi",
                "Misuri", "Montana", "Nebraska", "Nevada", "Northern Mariana Islands",
                "Nueva Jersey", "Nueva York", "Nuevo Hampshire", "Nuevo México",
                "Ohio", "Oklahoma", "Oregón", "Pensilvania", "Puerto Rico",
                "Rhode Island", "Tennessee", "Texas", "U.S. Outlying Islands",
                "U.S. Virgin Islands", "Utah", "Vermont", "Virginia",
                "Virginia Occidental", "Washington", "Washington D. C.",
                "Wisconsin", "Wyoming"
            ];

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].constraint).toBeTruthy();
            expect(info[1][1].constraint.length).toBe(expectedOrder.length);

            for (let i = 0; i < expectedOrder.length; i++) {
                expect(info[1][1].constraint[i].name).toBe(expectedOrder[i]);
            }
        });

        test('should return countries in correct alphabetical order', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            const expectedOrder = [
                "Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa",
                "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina",
                "Armenia", "Aruba", "Ascension Island", "Australia", "Austria",
                "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
                "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan",
                "Bolivia", "Bosnia & Herzegovina", "Botswana", "Bouvet Island",
                "Brazil", "British Indian Ocean Territory", "British Virgin Islands",
                "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
                "Cameroon", "Canada", "Canary Islands", "Cape Verde",
                "Caribbean Netherlands", "Cayman Islands", "Central African Republic",
                "Ceuta & Melilla", "Chad", "Chile", "China", "Christmas Island",
                "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros",
                "Congo - Brazzaville", "Congo - Kinshasa", "Cook Islands",
                "Costa Rica", "Côte d’Ivoire", "Croatia", "Cuba", "Curaçao",
                "Cyprus", "Czechia", "Denmark", "Diego Garcia", "Djibouti",
                "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
                "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
                "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France",
                "French Guiana", "French Polynesia", "French Southern Territories",
                "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar",
                "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala",
                "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
                "Heard & McDonald Islands", "Honduras", "Hong Kong SAR China",
                "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
                "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan",
                "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
                "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
                "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                "Macao SAR China", "Madagascar", "Malawi", "Malaysia", "Maldives",
                "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania",
                "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova",
                "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
                "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
                "Netherlands", "New Caledonia", "New Zealand", "Nicaragua",
                "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea",
                "North Macedonia", "Northern Mariana Islands", "Norway", "Oman",
                "Outlying Oceania", "Pakistan", "Palau", "Palestinian Territories",
                "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
                "Pitcairn Islands", "Poland", "Portugal", "Pseudo-Accents",
                "Pseudo-Bidi", "Puerto Rico", "Qatar", "Réunion", "Romania",
                "Russia", "Rwanda", "Samoa", "San Marino", "São Tomé & Príncipe",
                "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
                "Singapore", "Sint Maarten", "Slovakia", "Slovenia",
                "Solomon Islands", "Somalia", "South Africa",
                "South Georgia & South Sandwich Islands", "South Korea",
                "South Sudan", "Spain", "Sri Lanka", "St. Barthélemy",
                "St. Helena", "St. Kitts & Nevis", "St. Lucia", "St. Martin",
                "St. Pierre & Miquelon", "St. Vincent & Grenadines", "Sudan",
                "Suriname", "Svalbard & Jan Mayen", "Sweden", "Switzerland",
                "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
                "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad & Tobago",
                "Tristan da Cunha", "Tunisia", "Turkey", "Turkmenistan",
                "Turks & Caicos Islands", "Tuvalu", "U.S. Outlying Islands",
                "U.S. Virgin Islands", "Uganda", "Ukraine",
                "United Arab Emirates", "United Kingdom", "United States",
                "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
                "Vietnam", "Wallis & Futuna", "Western Sahara", "Yemen",
                "Zambia", "Zimbabwe"
            ];

            expect(info[2][0].component).toBe("country");
            expect(info[2][0].constraint).toBeTruthy();
            expect(info[2][0].constraint.length).toBe(expectedOrder.length);

            for (let i = 0; i < expectedOrder.length; i++) {
                expect(info[2][0].constraint[i].name).toBe(expectedOrder[i]);
            }
        });

        test('should return countries in Spanish when requested', async () => {
            const formatter = new AddressFmt({locale: 'en-US'});
            const info = await formatter.getFormatInfo("es");

            expect(info).toBeTruthy();
            const expectedOrder = [
                "Afganistán", "Albania", "Alemania", "Andorra", "Angola",
                "Anguila", "Antigua y Barbuda", "Arabia Saudí", "Argelia",
                "Argentina", "Armenia", "Aruba", "Australia", "Austria",
                "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin",
                "Bélgica", "Belice", "Benín", "Bermudas", "Bielorrusia",
                "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil",
                "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután",
                "Cabo Verde", "Camboya", "Camerún", "Canadá", "Caribe neerlandés",
                "Catar", "Ceuta y Melilla", "Chad", "Chequia", "Chile", "China",
                "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras",
                "Corea del Norte", "Corea del Sur", "Costa de Marfil",
                "Costa Rica", "Croacia", "Cuba", "Curazao", "Diego García",
                "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador",
                "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia",
                "España", "Estados Unidos", "Estonia", "Esuatini", "Etiopía",
                "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia",
                "Georgia", "Ghana", "Gibraltar", "Granada", "Grecia",
                "Groenlandia", "Guadalupe", "Guam", "Guatemala", "Guayana Francesa",
                "Guernsey", "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu",
                "Guyana", "Haití", "Honduras", "Hungría", "India", "Indonesia",
                "Irak", "Irán", "Irlanda", "Isla Bouvet", "Isla Clipperton",
                "Isla de la Ascensión", "Isla de Man", "Isla de Navidad",
                "Isla Norfolk", "Islandia", "Islas Åland", "Islas Caimán",
                "Islas Canarias", "Islas Cocos", "Islas Cook", "Islas Feroe",
                "Islas Georgia del Sur y Sandwich del Sur", "Islas Heard y McDonald",
                "Islas Malvinas", "Islas Marianas del Norte", "Islas Marshall",
                "Islas menores alejadas de EE. UU.", "Islas Pitcairn",
                "Islas Salomón", "Islas Turcas y Caicos", "Islas Vírgenes Británicas",
                "Islas Vírgenes de EE. UU.", "Israel", "Italia", "Jamaica",
                "Japón", "Jersey", "Jordania", "Kazajistán", "Kenia", "Kirguistán",
                "Kiribati", "Kosovo", "Kuwait", "Laos", "Lesoto", "Letonia",
                "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania",
                "Luxemburgo", "Macedonia del Norte", "Madagascar", "Malasia",
                "Malaui", "Maldivas", "Mali", "Malta", "Marruecos", "Martinica",
                "Mauricio", "Mauritania", "Mayotte", "México", "Micronesia",
                "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Montserrat",
                "Mozambique", "Myanmar (Birmania)", "Namibia", "Nauru", "Nepal",
                "Nicaragua", "Níger", "Nigeria", "Niue", "Noruega",
                "Nueva Caledonia", "Nueva Zelanda", "Omán", "Países Bajos",
                "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay",
                "Perú", "Polinesia Francesa", "Polonia", "Portugal", "Pseudoacentos",
                "Pseudobidi", "Puerto Rico", "RAE de Hong Kong (China)",
                "RAE de Macao (China)", "Reino Unido", "República Centroafricana",
                "República del Congo", "República Democrática del Congo",
                "República Dominicana", "Reunión", "Ruanda", "Rumanía", "Rusia",
                "Sahara Occidental", "Samoa", "Samoa Americana", "San Bartolomé",
                "San Cristóbal y Nieves", "San Marino", "San Martín",
                "San Pedro y Miquelón", "San Vicente y las Granadinas",
                "Santa Elena", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal",
                "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Sint Maarten",
                "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán",
                "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Svalbard y Jan Mayen",
                "Tailandia", "Taiwán", "Tanzania", "Tayikistán",
                "Territorio Británico del Océano Índico",
                "Territorios alejados de Oceanía", "Territorios Australes Franceses",
                "Territorios Palestinos", "Timor-Leste", "Togo", "Tokelau",
                "Tonga", "Trinidad y Tobago", "Tristán de Acuña", "Túnez",
                "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda",
                "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam",
                "Wallis y Futuna", "Yemen", "Yibuti", "Zambia", "Zimbabue"
            ];

            expect(info[2][0].component).toBe("country");
            expect(info[2][0].constraint).toBeTruthy();
            expect(info[2][0].constraint.length).toBe(expectedOrder.length);

            for (let i = 0; i < expectedOrder.length; i++) {
                expect(info[2][0].constraint[i].name).toBe(expectedOrder[i]);
            }
        });
    });

    describe('German Format Info', () => {
        test('should return correct German address components and constraints', async () => {
            const formatter = new AddressFmt({locale: 'de-DE'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(2);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Straßenadresse");
            expect(info[1][0].component).toBe("postalCode");
            expect(info[1][0].label).toBe("Postleitzahl");
            expect(info[1][0].constraint).toBe("[0-9]{5}");
            expect(info[1][1].component).toBe("locality");
            expect(info[1][1].label).toBe("Stadt");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Land");
            expect(info[2][0].constraint).toBeTruthy();
            
            let r = searchRegions(info[2][0].constraint, "RU");
            expect(r.code).toBe("RU");
            expect(r.name).toBe("Russland");
            r = searchRegions(info[2][0].constraint, "CA");
            expect(r.code).toBe("CA");
            expect(r.name).toBe("Kanada");
            r = searchRegions(info[2][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("Südafrika");
        });
    });

    describe('Chinese Format Info', () => {
        test('should return correct Chinese address components and constraints', async () => {
            const formatter = new AddressFmt({locale: 'zh-Hans-CN'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(4);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(1);
            expect(info[2].length).toBe(2);
            expect(info[3].length).toBe(1);

            expect(info[0][0].component).toBe("country");
            expect(info[0][0].label).toBe("国家/地区");
            expect(info[0][0].constraint).toBeTruthy();
            let r = searchRegions(info[0][0].constraint, "RU");
            expect(r.code).toBe("RU");
            expect(r.name).toBe("俄罗斯");
            r = searchRegions(info[0][0].constraint, "CA");
            expect(r.code).toBe("CA");
            expect(r.name).toBe("加拿大");
            r = searchRegions(info[0][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("南非");
            
            expect(info[1][0].component).toBe("region");
            expect(info[1][0].label).toBe("省或地区");
            expect(info[2][0].component).toBe("locality");
            expect(info[2][0].label).toBe("城市");
            expect(info[2][1].component).toBe("postalCode");
            expect(info[2][1].label).toBe("邮政编码");
            expect(info[2][1].constraint).toBe("[0-9]{6}$");
            expect(info[3][0].component).toBe("streetAddress");
            expect(info[3][0].label).toBe("地址");
        });
    });

    describe('Singapore Format Info', () => {
        test('should return correct Singapore address components and constraints', async () => {
            const formatter = new AddressFmt({locale: 'zh-Hans-SG'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(2);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(3);

            expect(info[0][0].component).toBe("country");
            expect(info[0][0].label).toBe("国家/地区");
            expect(info[0][0].constraint).toBeTruthy();
            let r = searchRegions(info[0][0].constraint, "RU");
            expect(r.code).toBe("RU");
            expect(r.name).toBe("俄罗斯");
            r = searchRegions(info[0][0].constraint, "CA");
            expect(r.code).toBe("CA");
            expect(r.name).toBe("加拿大");
            r = searchRegions(info[0][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("南非");
            
            expect(info[1][0].component).toBe("postalCode");
            expect(info[1][0].label).toBe("邮政编码");
            expect(info[1][0].constraint).toBe("^[0-9]{6}");
            expect(info[1][1].component).toBe("locality");
            expect(info[1][1].label).toBe("镇");
            expect(info[1][2].component).toBe("streetAddress");
            expect(info[1][2].label).toBe("地址");
        });

        test('should return correct English Singapore address components', async () => {
            const formatter = new AddressFmt({locale: 'en-SG'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(2);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Street Address");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("Town");
            expect(info[1][1].component).toBe("postalCode");
            expect(info[1][1].label).toBe("Post Code");
            expect(info[1][1].constraint).toBe("[0-9]{6}");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Country");
            expect(info[2][0].constraint).toBeTruthy();

            let r = searchRegions(info[2][0].constraint, "RU");
            expect(r.code).toBe("RU");
            expect(r.name).toBe("Russia");
            r = searchRegions(info[2][0].constraint, "CA");
            expect(r.code).toBe("CA");
            expect(r.name).toBe("Canada");
            r = searchRegions(info[2][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("South Africa");
        });
    });

    describe('Canadian Format Info', () => {
        test('should return correct Canadian address components and constraints', async () => {
            const formatter = new AddressFmt({locale: 'en-CA'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(3);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Street address");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("City");
            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("Province or territory");
            expect(info[1][1].constraint).toBeTruthy();
            let r = searchRegions(info[1][1].constraint, "NT");
            expect(r.code).toBe("NT");
            expect(r.name).toBe("Northwest Territories");
            r = searchRegions(info[1][1].constraint, "BC");
            expect(r.code).toBe("BC");
            expect(r.name).toBe("British Columbia");
            r = searchRegions(info[1][1].constraint, "QC");
            expect(r.code).toBe("QC");
            expect(r.name).toBe("Quebec");
            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].label).toBe("Postal code");
            expect(info[1][2].constraint).toBe("[A-Za-z][0-9][A-Za-z]\\s+[0-9][A-Za-z][0-9]");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Country");
        });

        test('should return Canadian format info with German labels when requested', async () => {
            const formatter = new AddressFmt({locale: 'en-CA'});
            const info = await formatter.getFormatInfo("de");

            expect(info).toBeTruthy();
            expect(info.length).toBe(3);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(3);
            expect(info[2].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Straßenadresse");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("Stadt");
            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("Provinz oder Gebiet");
            expect(info[1][1].constraint).toBeTruthy();
            let r = searchRegions(info[1][1].constraint, "NT");
            expect(r.code).toBe("NT");
            expect(r.name).toBe("Nordwest-Territorien");
            r = searchRegions(info[1][1].constraint, "BC");
            expect(r.code).toBe("BC");
            expect(r.name).toBe("British Columbia");
            r = searchRegions(info[1][1].constraint, "QC");
            expect(r.code).toBe("QC");
            expect(r.name).toBe("Québec");
            expect(info[1][2].label).toBe("Postleitzahl");
            expect(info[1][2].constraint).toBe("[A-Za-z][0-9][A-Za-z]\\s+[0-9][A-Za-z][0-9]");
            expect(info[2][0].component).toBe("country");
            expect(info[2][0].label).toBe("Land");
        });
    });

    describe('UK Format Info', () => {
        test('should return correct UK address components and constraints', async () => {
            const formatter = new AddressFmt({locale: 'en-GB'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();
            expect(info.length).toBe(4);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(1);
            expect(info[2].length).toBe(1);
            expect(info[3].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Street address");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("Town");
            expect(info[2][0].component).toBe("postalCode");
            expect(info[2][0].label).toBe("Post code");
            expect(info[2][0].constraint).toBe("([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            expect(info[3][0].component).toBe("country");
            expect(info[3][0].label).toBe("Country");
        });

        test('should return UK format info with Russian translations', async () => {
            const formatter = new AddressFmt({locale: 'en-GB'});
            const info = await formatter.getFormatInfo("ru");

            expect(info).toBeTruthy();
            expect(info.length).toBe(4);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(1);
            expect(info[2].length).toBe(1);
            expect(info[3].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("Адрес");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("Город");
            expect(info[2][0].component).toBe("postalCode");
            expect(info[2][0].label).toBe("Почтовый индекс");
            expect(info[2][0].constraint).toBe("([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            expect(info[3][0].component).toBe("country");
            expect(info[3][0].label).toBe("Страна");
        });

        test('should return UK format info with Korean translations', async () => {
            const formatter = new AddressFmt({locale: 'en-GB'});
            const info = await formatter.getFormatInfo("ko");

            expect(info).toBeTruthy();
            expect(info.length).toBe(4);
            expect(info[0].length).toBe(1);
            expect(info[1].length).toBe(1);
            expect(info[2].length).toBe(1);
            expect(info[3].length).toBe(1);

            expect(info[0][0].component).toBe("streetAddress");
            expect(info[0][0].label).toBe("번지");
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("읍");
            expect(info[2][0].component).toBe("postalCode");
            expect(info[2][0].label).toBe("우편 번호");
            expect(info[2][0].constraint).toBe("([A-Za-z]{1,2}[0-9]{1,2}[ABCDEFGHJKMNPRSTUVWXYabcdefghjkmnprstuvwxy]?\\s+[0-9][A-Za-z]{2}|GIR 0AA|SAN TA1)");
            expect(info[3][0].component).toBe("country");
            expect(info[3][0].label).toBe("국가");
        });
    });

    describe('Unknown Country Format Info', () => {
        test('should return generic format info for unknown country', async () => {
            const formatter = new AddressFmt({locale: 'en-XY'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();

            // test for generic root data
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].label).toBe("City");
            expect(info[1][0].constraint).toBe("([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("Province");
            expect(info[1][1].constraint).toBe("([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].label).toBe("Postal Code");
            expect(info[1][2].constraint).toBe("[0-9]+");
        });
    });

    describe('Regional Label Translations', () => {
        test('should return correct Japanese region label in English', async () => {
            const formatter = new AddressFmt({locale: 'ja-JP'});
            const info = await formatter.getFormatInfo("en");

            expect(info).toBeTruthy();

            for (let i = 0; i < info.length; i++) {
                for (let j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        expect(info[i][j].label).toBe("Prefecture");
                    }
                }
            }
        });

        test('should return correct Japanese region label in Japanese', async () => {
            const formatter = new AddressFmt({locale: 'ja-JP'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();

            for (let i = 0; i < info.length; i++) {
                for (let j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        expect(info[i][j].label).toBe("都道府県");
                    }
                }
            }
        });

        test('should return correct Russian region label in English', async () => {
            const formatter = new AddressFmt({locale: 'ru-RU'});
            const info = await formatter.getFormatInfo("en");

            expect(info).toBeTruthy();

            for (let i = 0; i < info.length; i++) {
                for (let j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        expect(info[i][j].label).toBe("Oblast");
                    }
                }
            }
        });

        test('should return correct Russian region label in Russian', async () => {
            const formatter = new AddressFmt({locale: 'ru-RU'});
            const info = await formatter.getFormatInfo();

            expect(info).toBeTruthy();

            for (let i = 0; i < info.length; i++) {
                for (let j = 0; j < info[i].length; j++) {
                    if (info[i][j].component === "region") {
                        expect(info[i][j].label).toBe("Область");
                    }
                }
            }
        });
    });
}); 
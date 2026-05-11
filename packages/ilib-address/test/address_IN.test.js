/*
 * address_IN.test.js - India address parsing and formatting tests for ilib-address
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

let setUpPerformed = false;

describe('address_IN', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            let promise = Promise.resolve(true);
            ["bn-IN", "hi-IN", "gu-IN", "kn-IN", "mr-IN", "te-IN", "ta-IN"].forEach(locale => {
                promise = promise.then(() => {
                    return LocaleData.ensureLocale(locale);
                });
            });
            await promise;
        }
    });

    describe('Address parsing - Hindi locale', () => {
        const testCases = [
            {
                name: 'should parse normal India address in Hindi with all components',
                address: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\n७०००१७\nभारत",
                locale: 'hi-IN',
                expected: {
                    streetAddress: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू",
                    locality: "कोलकाता",
                    region: "पश्चिम बंगाल",
                    postalCode: "७०००१७",
                    country: "भारत",
                    countryCode: "IN"
                }
            },
            {
                name: 'should parse India address in Hindi without postal code',
                address: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\nभारत",
                locale: 'hi-IN',
                expected: {
                    streetAddress: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू",
                    locality: "कोलकाता",
                    region: "पश्चिम बंगाल",
                    postalCode: undefined,
                    country: "भारत",
                    countryCode: "IN"
                }
            },
            {
                name: 'should parse India address in Hindi without country',
                address: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\n७०००१७",
                locale: 'hi-IN',
                expected: {
                    streetAddress: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू",
                    locality: "कोलकाता",
                    region: "पश्चिम बंगाल",
                    postalCode: "७०००१७",
                    country: undefined,
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Gujarati locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Gujarati without postal code',
                address: "125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ\nકોલકાતા\nપશ્ચિમ બંગાળ\nભારત",
                locale: 'gu-IN',
                expected: {
                    streetAddress: "125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ",
                    locality: "કોલકાતા",
                    region: "પશ્ચિમ બંગાળ",
                    postalCode: undefined,
                    country: "ભારત",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Kannada locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Kannada without postal code',
                address: "125/1, ಎಜಿ ಟವರ್ಸ್. 3 ನೇ ಮಹಡಿ, ಪಾರ್ಕ್ ಸ್ಟ್ರೀಟ್. ಸರ્ಕಸ್ ಅವೆನ್ಯೂ\nಕಲ್ಕತ್ತಾ\nಪಶ್ಚಿಮ ಬಂಗಾಳ\nಭಾರತ",
                locale: 'kn-IN',
                expected: {
                    streetAddress: "125/1, ಎಜಿ ಟವರ್ಸ್. 3 ನೇ ಮಹಡಿ, ಪಾರ್ಕ್ ಸ್ಟ್ರೀಟ್. ಸರ્ಕಸ್ ಅವೆನ್ಯೂ",
                    locality: "ಕಲ್ಕತ್ತಾ",
                    region: "ಪಶ್ಚಿಮ ಬಂಗಾಳ",
                    postalCode: undefined,
                    country: "ಭಾರತ",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Marathi locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Marathi without postal code',
                address: "125/1, एजी टॉवर्स. 3 रा मजला, पार्क स्ट्रीट. सर्कस ऍव्हेन्यू\nकलकत्ता\nपश्चिम बंगाल\nभारत",
                locale: 'mr-IN',
                expected: {
                    streetAddress: "125/1, एजी टॉवर्स. 3 रा मजला, पार्क स्ट्रीट. सर्कस ऍव्हेन्यू",
                    locality: "कलकत्ता",
                    region: "पश्चिम बंगाल",
                    postalCode: undefined,
                    country: "भारत",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Telugu locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Telugu without postal code',
                address: "125/1, AG టవర్స్. 3 వ అంతస్తు, పార్క్ స్ట్రీట్. సర్కస్ ఎవెన్యూ \nకలకత్తా \nపశ్చిమ బెంగాల్\nభారతదేశం",
                locale: 'te-IN',
                expected: {
                    streetAddress: "125/1, AG టవర్స్. 3 వ అంతస్తు, పార్క్ స్ట్రీట్. సర్కస్ ఎవెన్యూ",
                    locality: "కలకత్తా",
                    region: "పశ్చిమ బెంగాల్",
                    postalCode: undefined,
                    country: "భారతదేశం",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Tamil locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Tamil without postal code',
                address: "125/1, ஏஜி டவர்ஸ். 3 வது மாடி, பார்க் தெரு. சர்க்கஸ் அவென்யூ\nகல்கத்தா\nமேற்கு வங்காளம்\nஇந்தியா",
                locale: 'ta-IN',
                expected: {
                    streetAddress: "125/1, ஏஜி டவர்ஸ். 3 வது மாடி, பார்க் தெரு. சர்க்கஸ் அவென்யூ",
                    locality: "கல்கத்தா",
                    region: "மேற்கு வங்காளம்",
                    postalCode: undefined,
                    country: "இந்தியா",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing - Bengali locale', () => {
        const testCases = [
            {
                name: 'should parse India address in Bengali without postal code',
                address: "125/1, এজি টাওয়ার্স. 3 য় তল, পার্ক স্ট্রীট. সার্কাস অ্যাভিনিউ\nকলকাতা\nপশ্চিম বঙ্গ\nভারত",
                locale: 'bn-IN',
                expected: {
                    streetAddress: "125/1, এজি টাওয়ার্স. 3 য় তল, পার্ক স্ট্রীট. সার্কাস অ্যাভিনিউ",
                    locality: "কলকাতা",
                    region: "পশ্চিম বঙ্গ",
                    postalCode: undefined,
                    country: "ভারত",
                    countryCode: "IN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format India address in Hindi locale',
                address: {
                    streetAddress: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू",
                    locality: "कोलकाता",
                    region: "पश्चिम बंगाल",
                    postalCode: "७०००१७",
                    country: "भारत",
                    countryCode: "IN"
                },
                locale: 'hi-IN',
                expected: "१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\n७०००१७\nभारत"
            },
            {
                name: 'should format India address in English locale',
                address: {
                    streetAddress: "125/1, AG Towers, 3rd Floor, Park Street, Circus Avenue",
                    locality: "Kolkata",
                    region: "West Bengal",
                    postalCode: "700017",
                    country: "India",
                    countryCode: "IN"
                },
                locale: 'en-IN',
                expected: "125/1, AG Towers, 3rd Floor, Park Street, Circus Avenue\nKolkata\nWest Bengal\n700017\nIndia"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 
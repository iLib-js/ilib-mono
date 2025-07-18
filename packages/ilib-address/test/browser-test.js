/*
 * browser-test.js - simplified browser tests for ilib-address
 *
 * Copyright © 2025, JEDLSoft
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

import Address from '../src/Address.js';

describe('Basic Address functionality', () => {
    test('should create an Address instance', () => {
        const address = new Address("123 Main St, Anytown, USA");
        expect(address).toBeDefined();
        expect(address.streetAddress).toBe("123 Main St");
        expect(address.locality).toBe("Anytown");
        expect(address.country).toBe("USA");
    });

    test('should parse US address correctly', () => {
        const address = new Address("456 Oak Ave, Springfield, IL 62701, USA");
        expect(address.streetAddress).toBe("456 Oak Ave");
        expect(address.locality).toBe("Springfield");
        expect(address.region).toBe("IL");
        expect(address.postalCode).toBe("62701");
        expect(address.country).toBe("USA");
    });

    test('should handle address object constructor', () => {
        const address = new Address({
            streetAddress: "789 Pine St",
            locality: "Chicago",
            region: "IL",
            postalCode: "60601",
            country: "USA"
        });
        expect(address.streetAddress).toBe("789 Pine St");
        expect(address.locality).toBe("Chicago");
        expect(address.region).toBe("IL");
        expect(address.postalCode).toBe("60601");
        expect(address.country).toBe("USA");
    });
}); 
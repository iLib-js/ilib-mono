/*
 * SerializerManager.test.js - test the Serializer factory
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

import { Serializer } from 'ilib-lint-common';

import SerializerManager from '../src/SerializerManager.js';

import XliffSerializer from '../src/plugins/XliffSerializer.js';
import LineSerializer from '../src/plugins/LineSerializer.js';

class MockSerializer extends Serializer {
    constructor(options) {
        super(options);
        this.name = "mock-serializer";
    }

    serialize(representation) {
        return "";
    }
}

// does not extend Serializer
class NotMockSerializer {
    constructor(options) {
        this.name = "not-mock-serializer";
        this.extensions = [ "xyz" ];
    }

    getExtensions() {
        return this.extensions;
    }
}

describe("testSerializerManager", () => {
    test("SerializerManager nothing to get when empty", () => {
        expect.assertions(1);

        const mgr = new SerializerManager();
        // not defined yet
        const serializer = mgr.get("js");

        expect(serializer).toBeUndefined();
    });

    test("SerializerManager add a serializer", () => {
        expect.assertions(3);

        const mgr = new SerializerManager();
        let serializer = mgr.get("mock-serializer");
        expect(serializer).toBeUndefined();

        mgr.add([MockSerializer]);
        serializer = mgr.get("mock-serializer");

        expect(serializer).toBeDefined();
        expect(serializer instanceof MockSerializer).toBeTruthy();
    });

    test("SerializerManager add serializer that do not inherit from Serializer", () => {
        expect.assertions(2);

        const mgr = new SerializerManager();
        let serializer = mgr.get("not-mock-serializer");
        expect(serializer).toBeUndefined();

        mgr.add([NotMockSerializer]);
        serializer = mgr.get("not-mock-serializer");

        expect(serializer).toBeUndefined();
    });

    test("SerializerManager make sure the built-in serializer are there", () => {
        expect.assertions(4);

        const mgr = new SerializerManager();
        let serializer = mgr.get("xliff");

        expect(serializer).toBeDefined();
        expect(serializer instanceof XliffSerializer).toBeTruthy();

        serializer = mgr.get("line");

        expect(serializer).toBeDefined();
        expect(serializer instanceof LineSerializer).toBeTruthy();
    });
});


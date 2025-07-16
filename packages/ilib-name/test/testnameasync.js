/*
 * testnameasync.js - test the name object
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

import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform, setLocale } from 'ilib-env';

let setUpPerformed = false;

export const testnameasync = {
    setUp: function(callback) {
        setLocale("en-US");
        LocaleData.clearCache();
        callback();
    },

    testNameAsyncEmptyConstructor: function(test) {
        test.expect(1);
        Name.create().then((name) => {
            test.ok(typeof(name) !== "undefined");
            test.done();
        });
    },

    testNameAsyncCopyConstructor: function(test) {
        test.expect(2);
        Name.create({
            prefix: "a",
            givenName: "b",
            middleName: "c",
            familyName: "d",
            suffix: "e",
            honorific: "x"
        }, {}).then((name) => {
            test.ok(typeof(name) !== "undefined");

            test.contains(name, { prefix: "a", givenName: "b", middleName: "c", familyName: "d", suffix: "e", honorific: "x"});
            test.done();
        });
    },

    testNameAsyncDEWithMultiplePrefixes: function(test) {
        test.expect(2);
        Name.create("Herr Dr. Josef Hans Jürgen Herzheim", {
            locale: "de-DE"
        }).then((name) => {
            test.ok(typeof(name) !== "undefined");

            test.contains(name, { prefix: "Herr Dr.", givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim" });
            test.done();
        });
    },

    testNameAsyncESFull: function(test) {
        test.expect(2);
        Name.create("Juan Carlos Maria León Arroyo", {
            locale: "es-ES"
        }).then((name) => {
            test.ok(typeof(name) !== "undefined");

            test.contains(name, { givenName: "Juan", middleName: "Carlos Maria", familyName: "León Arroyo" });
            test.done();
        });
    },

    testNameAsyncZHHonorific: function(test) {
        test.expect(2);
        Name.create("堂哥胡锦涛", {
            locale: "zh-CN"
        }).then((name) => {
            test.ok(typeof(name) !== "undefined");

            test.contains(name, { prefix: "堂哥", givenName: "锦涛", familyName: "胡" });
            test.done();
        });
    }
};

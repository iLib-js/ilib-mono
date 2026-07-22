/*
 * testnamefmtasync.js - test the name formatter object
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform, setLocale } from 'ilib-env';

let setUpPerformed = false;

export const testnamefmtasync = {
     setUp: function(callback) {
        setLocale("en-US");
        LocaleData.clearCache();
        callback();
    },

    testNameFmtAsyncConstructor: function(test) {
        test.expect(1);
        NameFmt.create().then((fmt) => {
            test.ok(typeof(fmt) !== "undefined");
            test.done();
        });
    },

    testNameFmtAsyncGetBogus: function(test) {
        test.expect(1);
        NameFmt.create({
            locale: "ii-II"
        }).then((fmt) => {
            test.equal(fmt.getLocale().getSpec(), "ii-II");
            test.done();
        });
    },

    testNameFmtAsyncENFull: function(test) {
        test.expect(1);
        Name.create({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        }, {
            sync: false,
        }).then((name) => {
            return NameFmt.create({
                style: "full"
            }).then((fmt) => {
                test.equal(fmt.format(name), "Mr. John Kevin Smith Phd.");
                test.done();
            });
        });
    },

    testNameFmtAsyncDEFull: function(test) {
        test.expect(1);
        Name.create({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE",
            sync: false,
        }).then((name) => {
            return NameFmt.create({
                style: "full",
                locale: "de-DE"
            }).then((fmt) => {
                test.equal(fmt.format(name), "Hr. Andreas Helmut Schmidt MdB");
                test.done();
            });
        });
    },

    testNameFmtAsyncZHFormalLong: function(test) {
        test.expect(1);
        Name.create({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN",
            sync: false,
        }).then((name) => {
            return NameFmt.create({
                style: "formal_long",
                locale: "zh-Hans-CN"
            }).then((fmt) => {
                test.equal(fmt.format(name), "李芳医生");
                test.done();
            });
        });
    },

    testNameFmtAsyncZHFormalLong: function(test) {
        test.expect(1);
        Name.create({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박"
        }, {
            locale: "ko-KR"
        }).then((name) => {
            return NameFmt.create({
                style: "formal_long",
                locale: "ko-KR"
            }).then((fmt) => {
                test.equal(fmt.format(name), "닥터 박은성");
                test.done();
            });
        });
    }
};

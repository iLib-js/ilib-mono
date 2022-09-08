/*
 * testIString.js - test the IString class
 *
 * Copyright © 2022 JEDLSoft
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

import IString from '../src/index.js';

import { setLocale } from 'ilib-env';
import Locale from 'ilib-locale';
import { LocaleData } from 'ilib-localedata';

export const testIStringAsync = {
    setUp: function(callback) {
        setLocale("en-US");
        LocaleData.clearCache();
        callback();
    },

    testStringFactory: function(test) {
        test.expect(1);
        IString.create().then(str => {
            test.ok(str !== null);
            test.done();
        });
    },

    testStringConstructorEmpty: function(test) {
        test.expect(3);
        IString.create().then(str => {
            test.ok(str !== null);

            test.equal(str.length, 0);
            test.equal(str.toString(), "");
            test.done();
        });
    },

    testStringConstructorFull: function(test) {
        test.expect(3);
        IString.create("test test test").then(str => {
            test.ok(str !== null);

            test.equal(str.length, 14);
            test.equal(str.toString(), "test test test");
            test.done();
        });
    },


    testStringFormatWithArg: function(test) {
        test.expect(2);
        IString.create("Format {size} string.").then(str => {
            test.ok(str !== null);

            test.equal(str.format({size: "medium"}), "Format medium string.");
            test.done();
        });
    },

    testStringFormatChoiceSimple1: function(test) {
        test.expect(2);
        IString.create("1#first string|2#second string").then(str => {
            test.ok(str !== null);

            test.equal(str.formatChoice(1), "first string");
            test.done();
        });
    },


    testStringFormatChoiceWithMultipleIndexesWithClassesRU0: function(test) {
        test.expect(2);
        IString.create(
            "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
            {locale: "ru-RU"}
        ).then(str => {
            test.ok(str !== null);

            var params = {
                num: 0,
                pages: 0
            };

            test.equal(str.formatChoice([params.num,params.pages], params), "0 items on 0 pages.");
            test.done();
        });
    },

    testStringFormatChoiceWithMultipleIndexesWithClassesRU1: function(test) {
        test.expect(2);
        IString.create(
            "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
            {locale: "ru-RU"}
        ).then(str => {
            test.ok(str !== null);

            var params = {
                num: 1,
                pages: 1
            };

            test.equal(str.formatChoice([params.num,params.pages], params), "1 item on 1 page.");
            test.done();
        });
    },

    testStringFormatChoiceWithMultipleIndexesWithClassesRU2: function(test) {
        test.expect(2);
        IString.create(
            "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
            {locale: "ru-RU"}
        ).then(str => {
            test.ok(str !== null);

            var params = {
                num: 3,
                pages: 1
            };

            test.equal(str.formatChoice([params.num,params.pages], params), "3 items (few) on 1 page.");
            test.done();
        });
    },

    testStringFormatChoiceWithMultipleIndexesWithClassesPT1: function(test) {
        test.expect(2);
        IString.create(
            "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|one,many#{num} item on {pages} pages (many).|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).|other,other#{num} items (other) on {pages} pages (other).",
            {locale: "pt-PT"}
        ).then(str => {
            test.ok(str !== null);

            var params = {
                num: 0,
                pages: 5
            };
            test.equal(str.formatChoice([params.num,params.pages], params), "0 items (other) on 5 pages (other).");
            test.done();
        });
    },


    testStringDelegateIndexOf: function(test) {
        test.expect(2);
        IString.create("abcdefghijklmnopqrstuvwxyz").then(str => {
            test.ok(str !== null);

            test.equal(str.indexOf("lmno"), 11);
            test.done();
        });
    },


    testIteratorComplex: function(test) {
        test.expect(10);
        IString.create("a\uD800\uDF02b\uD800\uDC00").then(str => {
            var it = str.iterator();
            test.ok(it.hasNext());
            test.equal(it.next(), 0x0061);
            test.ok(it.hasNext());
            test.equal(it.next(), 0x10302);
            test.ok(it.hasNext());
            test.equal(it.next(), 0x0062);
            test.ok(it.hasNext());
            test.equal(it.next(), 0x10000);
            test.ok(!it.hasNext());
            test.equal(it.next(), -1);
            test.done();
        });
    },

    testCodePointLengthWithSurrogates: function(test) {
        test.expect(2);
        IString.create("a\uD800\uDF02b\uD800\uDC00").then(str => {
            test.equal(str.codePointLength(), 4);
            test.equal(str.length, 6);
            test.done();
        });
    },

    testStringIteratorWithOfOperator: function(test) {
        test.expect(14);
        IString.create("test test test").then(str => {
            const expected = [
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];
            let index = 0;

            // should automatically call the iterator
            for (let ch of str) {
                test.equal(ch, expected[index++]);
            }

            test.done();
        });
    },

    testStringIteratorWithOfOperatorWithSurrogates: function(test) {
        test.expect(16);
        IString.create("test\uD800\uDF02 t\uD800\uDC00est test").then(str => {
            const expected = [
                "t",
                "e",
                "s",
                "t",
                "\uD800\uDF02",
                " ",
                "t",
                "\uD800\uDC00",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];
            let index = 0;

            // should automatically call the iterator and iterate
            // through the "astal plane" characters properly
            for (let ch of str) {
                test.equal(ch, expected[index++]);
            }

            test.done();
        });
    },

    testStringIteratorWithSpreadOperator: function(test) {
        test.expect(1);
        IString.create("test test test").then(str => {
            const expected = [
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];

            // should automatically call the iterator
            const actual = [...str];

            test.deepEqual(actual, expected);

            test.done();
        });
    },

    testStringIteratorWithSpreadOperatorWithSurrogates: function(test) {
        test.expect(1);
        IString.create("test\uD800\uDF02 t\uD800\uDC00est test").then(str => {
            const expected = [
                "t",
                "e",
                "s",
                "t",
                "\uD800\uDF02",
                " ",
                "t",
                "\uD800\uDC00",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];

            // should automatically call the iterator and iterate
            // properly over the UTF-16 characters
            const actual = [...str];

            test.deepEqual(actual, expected);

            test.done();
        });
    }
};
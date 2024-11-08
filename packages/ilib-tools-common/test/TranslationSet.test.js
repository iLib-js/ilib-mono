/*
 * TranslationSet.test.js - test the Translation Set object.
 *
 * Copyright © 2016-2017, 2022-2023 HealthTap, Inc. and JEDLSoft
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

import { TranslationSet, ResourceString, ResourceArray } from "../src/index.js";

describe("testTranslationSet", () => {
     test("TranslationSetConstructor", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        expect(ts).toBeTruthy();
    });

    test("TranslationSetRightSourceLocaleDefault", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        expect(ts.sourceLocale).toBe("zxx-XX");
    });

    test("TranslationSetGetEmpty", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        const r = ts.get("asdf");

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGet", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            project: "foo",
            source: "This is a test",
            target: "Dies ist einen Test.",
            datatype: "html"
        });

        ts.add(res);

        const r = ts.get(ResourceString.hashKey("foo", res.getSourceLocale(), "asdf", "html"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationIsDirtyNew", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyTrue", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyFalse", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyTrue2", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        res = new ResourceString({
            key: "asdfasdfasdf",
            source: "This is another test"
        });

        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyAddSameResourceTwice", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        // should not set the flag to dirty because the resource
        // is already there, so nothing is added
        ts.add(res);

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyUpdateSource", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            project: "foo",
            sourceLocale: "en-US",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        res = new ResourceString({
            key: "asdf",
            project: "foo",
            sourceLocale: "en-US",
            source: "This is a new test"
        });

        // should not set the flag to dirty because the resource
        // is already there, so nothing is added
        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationSetGetIgnoreContext", () => {
        expect.assertions(3);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });

        ts.add(res);

        // should not overwrite the one above
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            target: "Dies ist einen Test.",
            context: "different"
        });

        ts.add(res);

        const r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();
    });

    test("TranslationSetGetDifferentTypesSameKeyIsOkay", () => {
        expect.assertions(6);

        const ts = new TranslationSet();
        const res1 = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "this too"]
        });

        ts.add(res1);

        const res2 = new ResourceString({
            key: "asdf", // same key
            source: "This is a test"
        });

        ts.add(res2);

        // default type is string
        let r = ts.get(ResourceString.hashKey(undefined, res2.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.resType).toBe("string");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceArray.hashKey(undefined, undefined, res1.getSourceLocale(), "asdf"));

        expect(r.getKey()).toBe("asdf");
        expect(r.resType).toBe("array");
        expect(r.getSource()).toStrictEqual(["This is a test", "this too"]);
    });

    test("TranslationSetGetUndefined", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const r = ts.get();

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetFromMany", () => {
        expect.assertions(4);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });

        ts.add(res);

        let r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "qwerty", "plaintext"));

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySource", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });

        ts.add(res);

        const r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetGetBySourceNonAutoKey", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        const r = ts.getBySource("This is a test");

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetBySourceFromMany", () => {
        expect.assertions(4);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "qwerty",
            autoKey: true,
            source: "This is another test"
        });

        ts.add(res);

        let r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = ts.getBySource("This is another test");

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySourceUndefined", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const r = ts.getBySource();

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetBySourceWithContext", () => {
        expect.assertions(6);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
            // no context
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test",
            target: "Dies ist einen Test.",
            context: "foo"
        });

        ts.add(res);

        let r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();

        r = ts.getBySource("This is a test", "foo");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(r.getContext()).toBe("foo");
    });

    test("TranslationSetGetBySourceOnlyAutoKeys", () => {
        expect.assertions(6);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "r3423423",
            autoKey: true,
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "explicit_id",
            source: "This is a test"
        });

        ts.add(res);

        let r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("r3423423");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "explicit_id", "plaintext"));

        expect(r.getKey()).toBe("explicit_id");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "r3423423", "plaintext"));

        expect(r.getKey()).toBe("r3423423");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetGetAll", () => {
        expect.assertions(6);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });

        ts.add(res);

        const resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        let r = resources[0];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = resources[1];

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetAllEmpty", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        const r = ts.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("TranslationSetAddTranslationMerged", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE"
        });

        ts.add(res);

        const resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
    });

    test("TranslationSetAddTranslationDifferentContext", () => {
        expect.assertions(2);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            target: "Dies ist einen Test.",
            sourceLocale: "en-US"
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE",
            context: "foo"
        });

        ts.add(res);

        const resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
    });

    test("TranslationSetAddAll", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        const r = ts.get(ResourceString.hashKey(undefined, "en-US", "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetAddAllDifferentContexts", () => {
        expect.assertions(8);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                context: "foo"
            })
        ]);

        const resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        let r = resources[0];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();

        r = resources[1];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(r.getContext()).toBe("foo");
    });

    test("TranslationSetAddAllRightSize", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetAddTranslationUndefined", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        try {
            expect(ts.size()).toBe(0);
            ts.add(undefined);
            expect(ts.size()).toBe(0);
        } catch (e) {
            test.fail();
        }
    });

    test("TranslationSetAddAllEmpty", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll([]);

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetAddAllUndefined", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll(undefined);

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetSize", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        const res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.size()).toBe(1);
    });

    test("TranslationSetSizeMultiple", () => {
        expect.assertions(1);

        const ts = new TranslationSet();
        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            target: "Dies ist einen Test.",
            context: "different"
        });

        ts.add(res);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetEmpty", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetSizeMerged", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        let res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.size()).toBe(1);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE"
        });

        ts.add(res);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetSizeAddAll", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetAddSet", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "foobar",
                source: "This is yet another test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(4);
    });

    test("TranslationSetAddSetRightContents", () => {
        expect.assertions(10);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "foobar",
                source: "This is yet another test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        ts1.addSet(ts2);

        const r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(4);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");

        expect(r[2].reskey).toBe("foobar");
        expect(r[2].getSource()).toBe("This is yet another test");

        expect(r[3].reskey).toBe("blahblah");
        expect(r[3].getSource()).toBe("One of its feet is both the same.");
    });

    test("TranslationSetAddSetMerge", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(3);
    });

    test("TranslationSetAddSetMergeRightContents", () => {
        expect.assertions(8);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        ts1.addSet(ts2);

        const r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");

        expect(r[2].reskey).toBe("blahblah");
        expect(r[2].getSource()).toBe("One of its feet is both the same.");
    });

    test("TranslationSetAddSetEmpty", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(2);
    });

    test("TranslationSetAddSetEmptyRightContents", () => {
        expect.assertions(6);

        const ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts1.addSet(ts2);

        const r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
    });

    test("TranslationSetAddSetUndefined", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(undefined);

        expect(ts1.size()).toBe(2);
    });

    test("TranslationSetAddSetUndefinedRightContents", () => {
        expect.assertions(6);

        const ts1 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts1.addSet(undefined);

        const r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySingleField", () => {
        expect.assertions(6);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                source: "test test",
                target: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test",
                target: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test",
                target: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "test test",
                target: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const r = ts.getBy({
            project: "yowza"
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("llashdfoi");
        expect(r[0].getTarget()).toBe("blah blah blah");

        expect(r[1].reskey).toBe("ajajsdjdsj");
        expect(r[1].getTarget()).toBe("blah blah blah en espanol");
    });

    test("TranslationSetGetByDoubleFields", () => {
        expect.assertions(17);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const r = ts.getBy({
            project: "foo",
            targetLocale: "de-DE"
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getProject()).toBe("foo");
        expect(r[0].getTargetLocale()).toBe("de-DE");
        expect(r[0].getContext()).toBe("bar");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
        expect(r[1].getProject()).toBe("foo");
        expect(r[1].getTargetLocale()).toBe("de-DE");
        expect(r[1].getContext()).toBe("bar");

        expect(r[2].reskey).toBe("qwerty");
        expect(r[2].getSource()).toBe("This is another test");
        expect(r[2].getProject()).toBe("foo");
        expect(r[2].getTargetLocale()).toBe("de-DE");
        expect(!r[2].getContext()).toBeTruthy();
    });

    test("TranslationSetGetByOrOperator", () => {
        expect.assertions(17);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "de-DE",
                context: "ajajajaj"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        // should match one or the other
        const r = ts.getBy({
            targetLocale: ["en-US", "de-DE"]
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(5);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getTargetLocale()).toBe("de-DE");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
        expect(r[1].getTargetLocale()).toBe("de-DE");

        expect(r[2].reskey).toBe("qwerty");
        expect(r[2].getSource()).toBe("This is another test");
        expect(r[2].getTargetLocale()).toBe("de-DE");

        expect(r[3].reskey).toBe("qwerty");
        expect(r[3].getSource()).toBe("This is yet another test");
        expect(r[3].getTargetLocale()).toBe("de-DE");

        expect(r[4].reskey).toBe("llashdfoi");
        expect(r[4].getSource()).toBe("blah blah blah");
        expect(r[4].getTargetLocale()).toBe("en-US");
    });

    test("TranslationSetGetProjects", () => {
        expect.assertions(5);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const projects = ts.getProjects();

        expect(projects).toBeTruthy();
        expect(projects.length).toBe(3);

        expect(projects[0]).toBe("foo");
        expect(projects[1]).toBe("asdf");
        expect(projects[2]).toBe("yowza");
    });

    test("TranslationSetGetProjectsEmpty", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        const projects = ts.getProjects();

        expect(!projects).toBeTruthy();
    });

    test("TranslationSetGetContexts", () => {
        expect.assertions(4);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const contexts = ts.getContexts("foo");

        expect(contexts).toBeTruthy();
        expect(contexts.length).toBe(2);

        expect(contexts[0]).toBe("bar");
        expect(contexts[1]).toBe("");
    });

    test("TranslationSetGetContextsEmpty", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        const contexts = ts.getContexts("foo");

        expect(!contexts).toBeTruthy();
    });

    test("TranslationSetGetContextsOnlyRoot", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const contexts = ts.getContexts("yowza");

        expect(contexts).toBeTruthy();
        expect(contexts.length).toBe(1);

        expect(contexts[0]).toBe("");
    });

    test("TranslationSetGetLocales", () => {
        expect.assertions(5);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        const locales = ts.getLocales("foo", "bar");

        expect(locales).toBeTruthy();
        expect(locales.length).toBe(3);

        expect(locales[0]).toBe("de-DE");
        expect(locales[1]).toBe("fr-FR");
        expect(locales[2]).toBe("nl-NL");
    });

    test("TranslationSetGetLocalesEmpty", () => {
        expect.assertions(1);

        const ts = new TranslationSet();

        const locales = ts.getLocales("foo", "bar");

        expect(!locales).toBeTruthy();
    });

    test("TranslationSetClear", () => {
        expect.assertions(2);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        ts.clear();

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetClearReallyGone", () => {
        expect.assertions(4);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        let resources = ts.getBy({project: "yowza"})

        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        ts.clear();

        resources = ts.getBy({project: "yowza"})

        expect(resources).toBeTruthy();
        expect(resources.length).toBe(0);
    });

    test("TranslationSetRemoveRightSize", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        expect(ts.remove(new ResourceString({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            key: "foobarfoo"
        }))).toBeTruthy();

        expect(ts.size()).toBe(9);
    });

    test("TranslationSetRemoveReallyGone", () => {
        expect.assertions(10);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        let res = ts.getBy({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            reskey: "foobarfoo",
            resType: "string"
        });

        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0].getProject()).toBe("asdf");
        expect(res[0].getContext()).toBe("bar");
        expect(res[0].getTargetLocale()).toBe("ja-JP");
        expect(res[0].getKey()).toBe("foobarfoo");
        expect(res[0].getSource()).toBe("test test blah");

        expect(ts.remove(new ResourceString({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            key: "foobarfoo"
        }))).toBeTruthy();

        res = ts.getBy({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            reskey: "foobarfoo",
            resType: "string"
        });

        expect(res).toBeTruthy();
        expect(res.length).toBe(0);
    });

    test("TranslationSetRemoveInsufficientFields", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // have to specify everything needed to identify a single resource
        expect(!ts.remove(ResourceString.hashKey(undefined, "bar", "ja-JP", "foobarfoo"))).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetRemoveBogusInput", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // have to specify everything needed to identify a single resource
        expect(!ts.remove(undefined)).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetRemoveNoMatch", () => {
        expect.assertions(3);

        const ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // does not match anything
        expect(!ts.remove(ResourceString.hashKey("ai jai jai", "blech", "en-NZ", "juicy"))).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetDiffRightSize", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet();
        const ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        const diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();
        expect(diff.size()).toBe(2);
    });

    test("TranslationSetDiffRightContents", () => {
        expect.assertions(14);

        const ts1 = new TranslationSet();
        const ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        const diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        let resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        // guarantee the order of the array elements
        resources = resources.sort(function(left, right) {return left.getTarget() < right.getTarget() ? 1 : (left.getTarget() > right.getTarget() ? -1 : 0)})

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is another test");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("nl-NL");
        expect(resources[0].getTarget()).toBe("gossie");

        expect(resources[1].getKey()).toBe("qwerty");
        expect(resources[1].getSource()).toBe("This is another test");
        expect(resources[1].getTarget()).toBe("Dies ist nochmals einen Test");
        expect(resources[1].getProject()).toBe("foo");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
    });

    test("TranslationSetDiffNoOverlap", () => {
        expect.assertions(14);

        const ts1 = new TranslationSet();
        const ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        const diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        let resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        // guarantee the order of the array elements
        resources = resources.sort(function(left, right) {return left.getTarget() < right.getTarget() ? 1 : (left.getTarget() > right.getTarget() ? -1 : 0)})

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is another test");
        expect(resources[0].getTarget()).toBe("gossie");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("nl-NL");

        expect(resources[1].getKey()).toBe("qwerty");
        expect(resources[1].getSource()).toBe("This is another test");
        expect(resources[1].getProject()).toBe("foo");
        expect(resources[1].getTarget()).toBe("Dies ist nochmals einen Test");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
    });

    test("TranslationSetDiffNoDiff", () => {
        expect.assertions(2);

        const ts1 = new TranslationSet();
        const ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        const diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        expect(diff.size()).toBe(0);
    });

    test("TranslationSetDiffChangedFields", () => {
        expect.assertions(8);

        const ts1 = new TranslationSet();
        const ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        const diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        const resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is yet another test");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("de-DE");
    });
});

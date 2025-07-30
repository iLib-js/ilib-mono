/*
 * ResourcePlural.test.js - test the resource plural object.
 *
 * Copyright © 2022-2023, 2025 JEDLSoft
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

import { ResourcePlural } from "../src/index.js";

describe("testResourcePlural", () => {
    test("ResourcePluralConstructorEmpty", () => {
        expect.assertions(1);

        const rp = new ResourcePlural();
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorNoProps", () => {
        expect.assertions(1);

        const rp = new ResourcePlural({});
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructor", () => {
        expect.assertions(1);

        const rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorRightContents", () => {
        expect.assertions(6);

        const rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            resfile: "i18n/en-US/strings.xml"
        });
        expect(rp).toBeTruthy();

        expect(rp.getKey()).toBe("asdf");
        expect(rp.getSource()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.pathName).toBe("a/b/c.java");
        expect(rp.getResFile()).toBe("i18n/en-US/strings.xml");
    });

    test("ResourcePluralConstructorFull", () => {
        expect.assertions(1);

        const rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorRightContentsFull", () => {
        expect.assertions(7);

        const rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();

        expect(rp.getKey()).toBe("asdf");
        expect(rp.getSource()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.pathName).toBe("a/b/c.java");
        expect(rp.getTargetLocale()).toBe("de-DE");
        expect(rp.getTarget()).toStrictEqual({
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });
    });

    test("ResourcePluralConstructorBackwardsCompatible", () => {
        expect.assertions(7);

        const rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();

        expect(rp.getKey()).toBe("asdf");
        expect(rp.getSourceStrings()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.pathName).toBe("a/b/c.java");
        expect(rp.getTargetLocale()).toBe("de-DE");
        expect(rp.getTargetStrings()).toStrictEqual({
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });
    });

    test("ResourcePluralConstructorDefaults", () => {
        expect.assertions(5);

        const rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();

        // got the right one?
        expect(rp.getKey()).toBe("asdf");

        // now the defaults
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.datatype).toBe("x-android-resource");
        expect(rp.resType).toBe("plural");
    });

    test("ResourcePluralGetKey", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getKey()).toBe("foo");
    });

    test("ResourcePluralGetSource", () => {
        expect.assertions(5);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getSourcePlural("one")).toBe("This is singular");
        expect(rp.getSourcePlural("two")).toBe("This is double");
        expect(rp.getSourcePlural("few")).toBe("This is the few case");
        expect(rp.getSourcePlural("many")).toBe("This is the many case");
    });

    test("ResourcePluralGetTarget", () => {
        expect.assertions(5);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getTargetPlural("one")).toBe("Dies ist einzigartig");
        expect(rp.getTargetPlural("two")).toBe("Dies ist doppelt");
        expect(rp.getTargetPlural("few")).toBe("Dies ist der wenige Fall");
        expect(rp.getTargetPlural("many")).toBe("Dies ist der viele Fall");
    });

    test("ResourcePluralGetMetadata", function() {
        expect.assertions(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            metadata:  {
                "test": "test-abcd"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getMetadata()).toStrictEqual({"test": "test-abcd"});
    });

    test("ResourcePluralGetMetadata2", function() {
        expect.assertions(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getMetadata()).toBeFalsy();
    });

    test("ResourcePluralSetMetadata", function() {
        expect.assertions(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            metadata:{}
        });
        expect(rp).toBeTruthy();
        rp.setMetadata({"test": "test-xyz"});
        expect(rp.getMetadata()).toStrictEqual({"test": "test-xyz"});
    });

    test("ResourcePluralGetNonExistent", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(!rp.getSourcePlural("zero")).toBeTruthy();
        expect(!rp.getTargetPlural("zero")).toBeTruthy();
    });

    test("ResourcePluralGetKeyEmpty", () => {
        expect.assertions(2);

        const rp = new ResourcePlural();
        expect(rp).toBeTruthy();
        expect(!rp.getKey()).toBeTruthy();
    });

    test("ResourcePluralGetContext", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            context: "landscape",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getContext()).toBe("landscape");
    });

    test("ResourcePluralGetContextEmpty", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(!rp.getContext()).toBeTruthy();
    });

    test("ResourcePluralGetSourcePlurals", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getSource()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
    });

    test("ResourcePluralGetTargetPlurals", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        expect(rp).toBeTruthy();
        expect(rp.getTarget()).toStrictEqual({
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });
    });


    test("ResourcePluralGetPluralsEmpty", () => {
        expect.assertions(2);

        const rp = new ResourcePlural();
        expect(rp).toBeTruthy();
        const plurals = rp.getSource();
        const count = 0;
        for (const p in plurals) {
            count++;
        }
        expect(count).toBe(0);
    });

    test("ResourcePluralClone", () => {
        expect.assertions(10);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        const rp2 = rp.clone();

        expect(rp2).toBeTruthy();
        expect(rp2.project).toBe(rp.project);
        expect(rp2.context).toBe(rp.context);
        expect(rp2.getSourceLocale()).toBe(rp.getSourceLocale());
        expect(rp2.reskey).toBe(rp.reskey);
        expect(rp2.strings).toStrictEqual(rp.strings);
        expect(rp2.pathName).toBe(rp.pathName);
        expect(rp2.comment).toBe(rp.comment);
        expect(rp2.state).toBe(rp.state);
    });

    test("ResourcePluralCloneWithOverrides", () => {
        expect.assertions(10);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        const rp2 = rp.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf"
        });

        expect(rp2).toBeTruthy();
        expect(rp2.project).toBe(rp.project);
        expect(rp2.context).toBe(rp.context);
        expect(rp2.getSourceLocale()).toBe("fr-FR");
        expect(rp2.reskey).toBe(rp.reskey);
        expect(rp2.strings).toStrictEqual(rp.strings);
        expect(rp2.pathName).toBe(rp.pathName);
        expect(rp2.comment).toBe(rp.comment);
        expect(rp2.state).toBe("asdfasdf");
    });

    test("ResourcePluralAddSource", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getSourcePlural("zero")).toBeTruthy();

        rp.addSourcePlural("zero", "This is the zero one")

        expect(rp.getSourcePlural("zero")).toBe("This is the zero one");
    });

    test("ResourcePluralAddSourceIsDirty", () => {
        expect.assertions(5);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getSourcePlural("zero")).toBeTruthy();
        expect(!rp.isDirty()).toBeTruthy();

        rp.addSourcePlural("zero", "This is the zero one")

        expect(rp.getSourcePlural("zero")).toBe("This is the zero one");
        expect(rp.isDirty()).toBeTruthy();
    });

    test("ResourcePluralAddSourceReplace", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.getSourcePlural("two")).toBe("This is double");

        rp.addSourcePlural("two", "This is two at a time")

        expect(rp.getSourcePlural("two")).toBe("This is two at a time");
    });

    test("ResourcePluralAddSourceSize", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addSourcePlural("many", "This is the many one")

        expect(rp.size()).toBe(4);
    });

    test("ResourcePluralAddSourceUndefined", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.getSourcePlural("one")).toBe("This is singular");

        rp.addSourcePlural("one", undefined)

        expect(rp.getSourcePlural("one")).toBe("This is singular");
    });

    test("ResourcePluralAddSourceNoClass", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addSourcePlural(undefined, "foobar")

        expect(rp.size()).toBe(3);
    });

    test("ResourcePluralAddSourceEmpty", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(0);

        rp.addSourcePlural("one", "foobar")

        expect(rp.size()).toBe(1);
    });

    test("ResourcePluralAddSourceEmptyRightContents", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getSourcePlural("one")).toBeTruthy();

        rp.addSourcePlural("one", "foobar")

        expect(rp.getSourcePlural("one")).toBe("foobar");
    });

    test("ResourcePluralAddSourceMultiple", () => {
        expect.assertions(6);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(rp).toBeTruthy();

        rp.addSourcePlural("one", "This is singular");
        rp.addSourcePlural("zero", "This is the zero one");

        expect(rp.getSourcePlural("zero")).toBe("This is the zero one");
        expect(rp.getSourcePlural("one")).toBe("This is singular");
        expect(rp.getSourcePlural("two")).toBe("This is double");
        expect(rp.getSourcePlural("few")).toBe("This is the few case");
        expect(rp.getSourcePlural("many")).toBe("This is the many case");
    });

    test("ResourcePluralAddTarget", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getTargetPlural("zero")).toBeTruthy();

        rp.addTargetPlural("zero", "This is the zero one")

        expect(rp.getTargetPlural("zero")).toBe("This is the zero one");
    });

    test("ResourcePluralAddTargetIsDirty", () => {
        expect.assertions(5);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.isDirty()).toBeTruthy();
        expect(!rp.getTargetPlural("zero")).toBeTruthy();

        rp.addTargetPlural("zero", "This is the zero one")

        expect(rp.getTargetPlural("zero")).toBe("This is the zero one");
        expect(rp.isDirty()).toBeTruthy();
    });

    test("ResourcePluralAddTargetReplace", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.getTargetPlural("two")).toBe("Dies ist doppelt");

        rp.addTargetPlural("two", "This is two at a time")

        expect(rp.getTargetPlural("two")).toBe("This is two at a time");
    });

    test("ResourcePluralAddTargetSize", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addTargetPlural("many", "This is the many one")

        expect(rp.size()).toBe(4);
    });

    test("ResourcePluralAddTargetUndefined", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.getTargetPlural("one")).toBe("Dies ist einzigartig");

        rp.addTargetPlural("one", undefined)

        expect(rp.getTargetPlural("one")).toBe("Dies ist einzigartig");
    });

    test("ResourcePluralAddTargetNoClass", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addTargetPlural(undefined, "foobar")

        expect(rp.size()).toBe(3);
    });

    test("ResourcePluralAddTargetEmpty", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(0);

        rp.addTargetPlural("one", "foobar")

        expect(rp.size()).toBe(1);
    });

    test("ResourcePluralAddTargetEmptyRightContents", () => {
        expect.assertions(3);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getTargetPlural("one")).toBeTruthy();

        rp.addTargetPlural("one", "foobar")

        expect(rp.getTargetPlural("one")).toBe("foobar");
    });

    test("ResourcePluralEqualsSourceOnly", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsFull", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsSourceOnlyNot", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsFullNot", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist ",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsIgnoreSomeFields", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsContentDifferent", () => {
        expect.assertions(3);

        const ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralStaticHashKey", () => {
        expect.assertions(1);

        expect(ResourcePlural.hashKey("androidapp", "foo", "de-DE", "This is a test")).toBe("rp_androidapp_foo_de-DE_This is a test");
    });

    test("ResourcePluralStaticHashKeyMissingParts", () => {
        expect.assertions(1);

        expect(ResourcePlural.hashKey(undefined, undefined, "de-DE", undefined)).toBe("rp___de-DE_");
    });

    test("ResourcePluralSourceOnlyHashKey", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.hashKey()).toBe("rp_foo_blah_en-US_asdf");
    });

    test("ResourcePluralFullHashKey", () => {
        expect.assertions(2);

        const rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            targetLocale: "de-DE",
            target: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist ",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.hashKey()).toBe("rp_foo_blah_de-DE_asdf");
    });

    test("ResourcePluralIsInstanceSame", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(rs).toBeTruthy();

        const dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourcePluralIsInstanceDifferingOnlyInWhitespace", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a test ",
                other: " These are tests"
            }
        });
        expect(rs).toBeTruthy();

        const dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a \ttest    ",
                other: " These  are tests "
            }
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourcePluralIsInstanceDifferingInSource", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(rs).toBeTruthy();

        const dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: {
                one: "This is a test",
                other: "These are tests."
            }
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourcePluralSetSource", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: { one: "singular", other: "plural" },
            target: { one: "singular", other: "plural" }
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual({ one: "singular", other: "plural" });
        rs.setSource({ one: "x", other: "y" });
        expect(rs.getSource()).toStrictEqual({ one: "x", other: "y" });
    });

    test("ResourcePluralSetSourceIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: { one: "singular", other: "plural" },
            target: { one: "singular", other: "plural" }
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual({ one: "singular", other: "plural" });
        expect(!rs.isDirty()).toBeTruthy();

        rs.setSource({ one: "x", other: "y" });
        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourcePluralSetTarget", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: { one: "singular", other: "plural" },
            target: { one: "singular", other: "plural" }
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual({ one: "singular", other: "plural" });
        rs.setTarget({ one: "x", other: "y" });
        expect(rs.getTarget()).toStrictEqual({ one: "x", other: "y" });
    });

    test("ResourcePluralSetTargetIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: { one: "singular", other: "plural" },
            target: { one: "singular", other: "plural" }
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual({ one: "singular", other: "plural" });
        expect(!rs.isDirty()).toBeTruthy();

        rs.setTarget({ one: "x", other: "y" });
        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourcePlural constructor with multi-key plural", () => {
        expect.assertions(3);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: [ "countFiles", "countDirs" ]
        });

        expect(rs).toBeTruthy();
        expect(rs.getSource()).toStrictEqual({
            "one,one": "There is {countFiles} file and {countDirs} directory",
            "one,other": "There are {countFiles} files and {countDirs} directories",
            "other,one": "There is {countFiles} file and {countDirs} directory",
            "other,other": "There are {countFiles} files and {countDirs} directories"
        });
        expect(rs.getPivots()).toStrictEqual([ "countFiles", "countDirs" ]);
    });

    test("ResourcePlural constructor with multi-key source and target plural and pivots", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "de-DE",
            target: {
                "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
                "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        expect(rs).toBeTruthy();
        expect(rs.getSource()).toStrictEqual({
            "one,one": "There is {countFiles} file and {countDirs} directory",
            "one,other": "There are {countFiles} files and {countDirs} directories",
            "other,one": "There is {countFiles} file and {countDirs} directory",
            "other,other": "There are {countFiles} files and {countDirs} directories"
        });
        expect(rs.getTarget()).toStrictEqual({
            "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
            "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
        });
        expect(rs.getPivots()).toStrictEqual(["countFiles", "countDirs"]);
    });

    test("ResourcePlural constructor with multi-key source and target plural and pivots in Polish", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({

            project: "foo",
            context: "blah",
            sourceLocale: "pl-PL",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "pl-PL",
            target: {
                "one,one": "Jest {countFiles} plik i {countDirs} katalog",
                "one,few": "Jest {countFiles} plik i {countDirs} katalogi",
                "one,other": "Jest {countFiles} plik i {countDirs} katalogów",
                "few,one": "Są {countFiles} pliki i {countDirs} katalog",
                "few,few": "Są {countFiles} pliki i {countDirs} katalogi",
                "few,other": "Są {countFiles} pliki i {countDirs} katalogów",
                "other,one": "Jest {countFiles} plików i {countDirs} katalog",
                "other,few": "Jest {countFiles} plików i {countDirs} katalogi",
                "other,other": "Jest {countFiles} plików i {countDirs} katalogów"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        expect(rs).toBeTruthy();
        expect(rs.getSource()).toStrictEqual({
            "one,one": "There is {countFiles} file and {countDirs} directory",
            "one,other": "There are {countFiles} files and {countDirs} directories",
            "other,one": "There is {countFiles} file and {countDirs} directory",
            "other,other": "There are {countFiles} files and {countDirs} directories"
        });
        expect(rs.getTarget()).toStrictEqual({
            "one,one": "Jest {countFiles} plik i {countDirs} katalog",
            "one,few": "Jest {countFiles} plik i {countDirs} katalogi",
            "one,other": "Jest {countFiles} plik i {countDirs} katalogów",
            "few,one": "Są {countFiles} pliki i {countDirs} katalog",
            "few,few": "Są {countFiles} pliki i {countDirs} katalogi",
            "few,other": "Są {countFiles} pliki i {countDirs} katalogów",
            "other,one": "Jest {countFiles} plików i {countDirs} katalog",
            "other,few": "Jest {countFiles} plików i {countDirs} katalogi",
            "other,other": "Jest {countFiles} plików i {countDirs} katalogów"
        });
        expect(rs.getPivots()).toStrictEqual(["countFiles", "countDirs"]);
    });

    test("ResourcePlural copy constructor with multi-key source and target plural and pivots", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "de-DE",
            target: {
                "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
                "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        const rs2 = new ResourcePlural(rs);

        expect(rs2).toBeTruthy();
        expect(rs2.getSource()).toStrictEqual({
            "one,one": "There is {countFiles} file and {countDirs} directory",
            "one,other": "There are {countFiles} files and {countDirs} directories",
            "other,one": "There is {countFiles} file and {countDirs} directory",
            "other,other": "There are {countFiles} files and {countDirs} directories"
        });
        expect(rs2.getTarget()).toStrictEqual({
            "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
            "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
        });
        expect(rs2.getPivots()).toStrictEqual(["countFiles", "countDirs"]);
    });

    test("ResourcePlural getClone() with multi-key source and target plural and pivots", () => {
        expect.assertions(4);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "de-DE",
            target: {
                "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
                "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        const rs2 = rs.clone();

        expect(rs2).toBeTruthy();
        expect(rs2.getSource()).toStrictEqual({
            "one,one": "There is {countFiles} file and {countDirs} directory",
            "one,other": "There are {countFiles} files and {countDirs} directories",
            "other,one": "There is {countFiles} file and {countDirs} directory",
            "other,other": "There are {countFiles} files and {countDirs} directories"
        });
        expect(rs2.getTarget()).toStrictEqual({
            "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
            "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
            "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
        });
        expect(rs2.getPivots()).toStrictEqual(["countFiles", "countDirs"]);
    });

    test("ResourcePlural getCategories() with multi-key source plural", () => {
        expect.assertions(1);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        // no target, so this should give the categories of the source plural
        expect(rs.getCategories()).toStrictEqual(["one,one", "one,other", "other,one", "other,other"]);
    });

    test("ResourcePlural getCategories() with multi-key source and target plural", () => {
        expect.assertions(1);

        const rs = new ResourcePlural({

            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "de-DE",
            target: {
                "one,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "one,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse",
                "other,one": "Es gibt {countFiles} Datei und {countDirs} Verzeichnis",
                "other,other": "Es gibt {countFiles} Dateien und {countDirs} Verzeichnisse"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        expect(rs.getCategories()).toStrictEqual(["one,one", "one,other", "other,one", "other,other"]);
    });

    test("ResourcePlural getCategories with multi-key source and target plural with pivots in Polish", () => {
        expect.assertions(2);

        const rs = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: {
                "zero,zero": "There are no files and no directories",
                "one,one": "There is {countFiles} file and {countDirs} directory",
                "one,other": "There are {countFiles} files and {countDirs} directories",
                "other,one": "There is {countFiles} file and {countDirs} directory",
                "other,other": "There are {countFiles} files and {countDirs} directories"
            },
            targetLocale: "pl-PL",
            target: {
                "one,one": "Jest {countFiles} plik i {countDirs} katalog",
                "one,few": "Jest {countFiles} plik i {countDirs} katalogi",
                "one,other": "Jest {countFiles} plik i {countDirs} katalogów",
                "few,one": "Są {countFiles} pliki i {countDirs} katalog",
                "few,few": "Są {countFiles} pliki i {countDirs} katalogi",
                "few,other": "Są {countFiles} pliki i {countDirs} katalogów",
                "other,one": "Jest {countFiles} plików i {countDirs} katalog",
                "other,few": "Jest {countFiles} plików i {countDirs} katalogi",
                "other,other": "Jest {countFiles} plików i {countDirs} katalogów"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            pivots: ["countFiles", "countDirs"]
        });

        expect(rs).toBeTruthy();

        // should give a superset of the source and target categories
        expect(rs.getCategories().sort()).toStrictEqual(["zero,zero", "one,one", "one,few", "one,other", "few,one", "few,few", "few,other", "other,one", "other,few", "other,other"].sort());
    });
});

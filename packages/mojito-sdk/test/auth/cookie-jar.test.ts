/*
 * cookie-jar.test.ts - unit tests for the Mojito session cookie jar
 *
 * Copyright © 2026 JEDLSoft
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CookieJar } from "../../src/auth/cookie-jar";

describe("CookieJar", () => {
    test("stores Set-Cookie values and builds a Cookie header", () => {
        const jar = new CookieJar();
        jar.store([
            "SESSION=abc123; Path=/; HttpOnly",
            "JSESSIONID=xyz; Path=/",
        ]);

        expect(jar.get("SESSION")).toBe("abc123");
        expect(jar.get("JSESSIONID")).toBe("xyz");
        expect(jar.headerValue()).toBe("SESSION=abc123; JSESSIONID=xyz");
    });

    test("overwrites cookies with the same name", () => {
        const jar = new CookieJar();
        jar.store(["SESSION=one"]);
        jar.store(["SESSION=two"]);
        expect(jar.get("SESSION")).toBe("two");
        expect(jar.headerValue()).toBe("SESSION=two");
    });

    test("ignores undefined headers and malformed pairs", () => {
        const jar = new CookieJar();
        jar.store(undefined);
        jar.store(["=novalue", "not-a-pair", "OK=1"]);
        expect(jar.get("OK")).toBe("1");
        expect(jar.headerValue()).toBe("OK=1");
    });

    test("storeFromResponse reads set-cookie headers", () => {
        const jar = new CookieJar();
        const response = new Response("ok", {
            status: 200,
            headers: { "set-cookie": "SESSION=from-response; Path=/" },
        });
        jar.storeFromResponse(response);
        expect(jar.get("SESSION")).toBe("from-response");
    });

    test("clear empties the jar", () => {
        const jar = new CookieJar();
        jar.store(["SESSION=abc"]);
        jar.clear();
        expect(jar.get("SESSION")).toBeUndefined();
        expect(jar.headerValue()).toBeUndefined();
    });

    test("an empty jar has no header and no cookies", () => {
        const jar = new CookieJar();
        expect(jar.headerValue()).toBeUndefined();
        expect(jar.get("SESSION")).toBeUndefined();
        expect(jar.get("")).toBeUndefined();
    });

    describe("store", () => {
        test("treats an empty list as a no-op", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=keep"]);
            jar.store([]);
            expect(jar.headerValue()).toBe("SESSION=keep");
        });

        test("skips blank, nameless, and equals-less cookies", () => {
            const jar = new CookieJar();
            jar.store([
                "",
                "   ",
                "SESSION",
                "SESSION;",
                "=novalue",
                "   =novalue",
                ";",
                "; Path=/",
                "OK=1",
                "ALSO=2; Path=/",
            ]);
            expect(jar.headerValue()).toBe("OK=1; ALSO=2");
            expect(jar.get("SESSION")).toBeUndefined();
        });

        test("stores an empty value, including one that is only whitespace", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=;", "JSESSIONID=   ; Path=/", "EMPTY="]);
            expect(jar.get("SESSION")).toBe("");
            expect(jar.get("JSESSIONID")).toBe("");
            expect(jar.get("EMPTY")).toBe("");
            expect(jar.headerValue()).toBe("SESSION=; JSESSIONID=; EMPTY=");
        });

        test("trims whitespace around the name and value", () => {
            const jar = new CookieJar();
            jar.store(["  SESSION  =  abc 123  ; Path=/; HttpOnly"]);
            expect(jar.get("SESSION")).toBe("abc 123");
            expect(jar.headerValue()).toBe("SESSION=abc 123");
        });

        test("keeps equals signs that are part of the value", () => {
            const jar = new CookieJar();
            jar.store(["token=abc=def=ghi; Path=/; Secure"]);
            expect(jar.get("token")).toBe("abc=def=ghi");
        });

        test("keeps quoted values without unquoting them", () => {
            const jar = new CookieJar();
            jar.store(['SESSION="quoted value"; Path=/']);
            expect(jar.get("SESSION")).toBe('"quoted value"');
        });

        test("ignores attributes after the first semicolon", () => {
            const jar = new CookieJar();
            jar.store([
                "SESSION=abc; Path=/; Domain=example.com; Secure; HttpOnly; SameSite=None; Partitioned",
                "JSESSIONID=xyz; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Max-Age=3600; Path=/",
            ]);
            expect(jar.get("SESSION")).toBe("abc");
            expect(jar.get("JSESSIONID")).toBe("xyz");
            expect(jar.get("Path")).toBeUndefined();
            expect(jar.get("Expires")).toBeUndefined();
            expect(jar.headerValue()).toBe("SESSION=abc; JSESSIONID=xyz");
        });

        test("does not drop a cookie just because Max-Age is zero", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=abc; Max-Age=0"]);
            expect(jar.get("SESSION")).toBe("abc");
        });

        test("treats cookie names as case-sensitive", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=lower", "Session=mixed", "session=upper"]);
            expect(jar.get("SESSION")).toBe("lower");
            expect(jar.get("Session")).toBe("mixed");
            expect(jar.get("session")).toBe("upper");
            expect(jar.headerValue()).toBe("SESSION=lower; Session=mixed; session=upper");
        });

        test("accepts names and values outside ASCII", () => {
            const jar = new CookieJar();
            jar.store(["lang=日本語; Path=/", "mojito.session=a_b-c.d%3D"]);
            expect(jar.get("lang")).toBe("日本語");
            expect(jar.get("mojito.session")).toBe("a_b-c.d%3D");
        });

        test("lets the last duplicate in one list win without reordering earlier cookies", () => {
            const jar = new CookieJar();
            jar.store([
                "SESSION=one",
                "JSESSIONID=keep",
                "SESSION=two",
                "not-a-pair",
                "SESSION=three",
            ]);
            expect(jar.get("SESSION")).toBe("three");
            expect(jar.headerValue()).toBe("SESSION=three; JSESSIONID=keep");
        });

        test("updating one cookie leaves the others in place", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=one", "JSESSIONID=xyz"]);
            jar.store(["JSESSIONID=updated"]);
            expect(jar.headerValue()).toBe("SESSION=one; JSESSIONID=updated");
        });

        test("a later valid store still works after only malformed headers", () => {
            const jar = new CookieJar();
            jar.store(["", "not-a-pair", "=x"]);
            expect(jar.headerValue()).toBeUndefined();
            jar.store(["SESSION=recovered"]);
            expect(jar.get("SESSION")).toBe("recovered");
        });
    });

    describe("bad inputs", () => {
        test("ignores null and undefined header lists", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=keep"]);
            jar.store(undefined);
            jar.store(null as unknown as undefined);
            expect(jar.get("SESSION")).toBe("keep");
        });

        test("does not parse a raw header string as a cookie list", () => {
            const jar = new CookieJar();
            jar.store("SESSION=abc; Path=/" as unknown as string[]);
            expect(jar.headerValue()).toBeUndefined();
            expect(jar.get("SESSION")).toBeUndefined();
        });

        test("throws when a Set-Cookie entry is not a string", () => {
            const jar = new CookieJar();
            expect(() => jar.store([null as unknown as string])).toThrow(TypeError);
            expect(() => jar.store([undefined as unknown as string])).toThrow(TypeError);
            expect(() => jar.store([1 as unknown as string])).toThrow(TypeError);
            expect(jar.headerValue()).toBeUndefined();
        });

        test("throws when the header list is not iterable", () => {
            const jar = new CookieJar();
            expect(() => jar.store(1 as unknown as string[])).toThrow(TypeError);
            expect(() => jar.store({ 0: "SESSION=abc" } as unknown as string[])).toThrow(TypeError);
        });

        test("stops at the first non-string entry and keeps earlier cookies", () => {
            const jar = new CookieJar();
            expect(() => jar.store(["SESSION=ok", null as unknown as string, "JSESSIONID=no"])).toThrow(
                TypeError,
            );
            expect(jar.get("SESSION")).toBe("ok");
            expect(jar.get("JSESSIONID")).toBeUndefined();
        });
    });

    describe("storeFromResponse", () => {
        test("stores every cookie returned by getSetCookie", () => {
            const jar = new CookieJar();
            const headers = new Headers();
            headers.append("set-cookie", "SESSION=abc; Path=/; HttpOnly");
            headers.append("set-cookie", "JSESSIONID=xyz; Path=/");
            jar.storeFromResponse(new Response("ok", { status: 200, headers }));
            expect(jar.headerValue()).toBe("SESSION=abc; JSESSIONID=xyz");
        });

        test("leaves existing cookies alone when the response has no Set-Cookie", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=keep"]);
            jar.storeFromResponse(new Response(null, { status: 204 }));
            expect(jar.get("SESSION")).toBe("keep");
        });

        test("does not fall back to get() when getSetCookie returns nothing", () => {
            const jar = new CookieJar();
            jar.storeFromResponse(responseWithHeaders({
                getSetCookie: () => [],
                get: () => "SESSION=from-get",
            }));
            jar.storeFromResponse(responseWithHeaders({
                getSetCookie: () => undefined,
                get: () => "JSESSIONID=from-get",
            }));
            expect(jar.headerValue()).toBeUndefined();
        });

        test("reads a single set-cookie header when getSetCookie is missing", () => {
            const jar = new CookieJar();
            jar.storeFromResponse(responseWithHeaders({
                get: (name) => name.toLowerCase() === "set-cookie"
                    ? "SESSION=from-get; Path=/; HttpOnly"
                    : null,
            }));
            expect(jar.get("SESSION")).toBe("from-get");
        });

        test("the get() fallback keeps only the first cookie of a comma-joined header", () => {
            const jar = new CookieJar();
            jar.storeFromResponse(responseWithHeaders({
                get: () => "SESSION=abc; Path=/, JSESSIONID=xyz; Path=/",
            }));
            expect(jar.get("SESSION")).toBe("abc");
            expect(jar.get("JSESSIONID")).toBeUndefined();
        });

        test("ignores a malformed set-cookie on the response", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=keep"]);
            jar.storeFromResponse(responseWithHeaders({
                getSetCookie: () => ["not-a-pair", "", "=x"],
            }));
            expect(jar.headerValue()).toBe("SESSION=keep");
        });

        test("overwrites a stored cookie from a later response", () => {
            const jar = new CookieJar();
            jar.store(["SESSION=old", "JSESSIONID=stay"]);
            jar.storeFromResponse(responseWithHeaders({
                getSetCookie: () => ["SESSION=new; Path=/"],
            }));
            expect(jar.headerValue()).toBe("SESSION=new; JSESSIONID=stay");
        });

        test("throws when the response or its headers are missing", () => {
            const jar = new CookieJar();
            expect(() => jar.storeFromResponse(undefined as unknown as Response)).toThrow(TypeError);
            expect(() => jar.storeFromResponse({ headers: undefined } as unknown as Response)).toThrow(
                TypeError,
            );
            expect(() => jar.storeFromResponse({ headers: null } as unknown as Response)).toThrow(TypeError);
        });

        test("ignores a non-function getSetCookie and uses get()", () => {
            const jar = new CookieJar();
            jar.storeFromResponse(responseWithHeaders({
                getSetCookie: "SESSION=ignored" as unknown as () => string[],
                get: () => "SESSION=from-get; Path=/",
            }));
            expect(jar.get("SESSION")).toBe("from-get");
        });
    });

    describe("clear", () => {
        test("is idempotent and allows later stores", () => {
            const jar = new CookieJar();
            jar.clear();
            jar.store(["SESSION=abc", "JSESSIONID=xyz"]);
            jar.clear();
            jar.clear();
            expect(jar.headerValue()).toBeUndefined();
            jar.store(["SESSION=again"]);
            expect(jar.headerValue()).toBe("SESSION=again");
            expect(jar.get("JSESSIONID")).toBeUndefined();
        });
    });
});

/**
 * Minimal response stand-in so tests can choose the getSetCookie path or the
 * single-header fallback without depending on the Fetch implementation.
 */
function responseWithHeaders(headers: {
    getSetCookie?: () => string[] | undefined;
    get?: (name: string) => string | null;
}): Response {
    return {
        headers: {
            get: headers.get ?? (() => null),
            ...headers,
        },
    } as unknown as Response;
}

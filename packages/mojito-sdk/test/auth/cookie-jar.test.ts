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
});

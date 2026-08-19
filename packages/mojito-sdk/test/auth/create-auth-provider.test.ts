/*
 * create-auth-provider.test.ts - unit tests for createAuthProvider wiring
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

import { createAuthProvider } from "../../src/auth";
import { HeaderAuth } from "../../src/auth/header-auth";
import { StatefulFormLoginAuth } from "../../src/auth/stateful-auth";

describe("createAuthProvider", () => {
    test("selects HeaderAuth for HEADER mode", async () => {
        const { auth, baseUrl, config } = createAuthProvider(
            {
                authenticationMode: "HEADER",
                scheme: "https",
                host: "mojito.example",
                port: 443,
                headers: {
                    "CF-Access-Client-Id": "id",
                    "CF-Access-Client-Secret": "secret",
                },
            },
            { loadCliConfig: false },
        );

        expect(baseUrl).toBe("https://mojito.example");
        expect(config.authenticationMode).toBe("HEADER");
        expect(auth).toBeInstanceOf(HeaderAuth);
        await expect(auth.authorize("https://mojito.example/api", "GET")).resolves.toEqual({
            "CF-Access-Client-Id": "id",
            "CF-Access-Client-Secret": "secret",
        });
    });

    test("selects StatefulFormLoginAuth for STATEFUL mode", () => {
        const { auth, baseUrl } = createAuthProvider(
            {
                authenticationMode: "STATEFUL",
                host: "localhost",
                port: 8080,
                username: "admin",
                password: "secret",
            },
            { loadCliConfig: false },
        );

        expect(baseUrl).toBe("http://localhost:8080");
        expect(auth).toBeInstanceOf(StatefulFormLoginAuth);
    });

    test("rejects STATELESS mode until MSAL support exists", () => {
        expect(() =>
            createAuthProvider(
                { authenticationMode: "STATELESS" },
                { loadCliConfig: false },
            ),
        ).toThrow(/STATELESS \(MSAL\) authentication is not implemented/);
    });

    test("rejects STATEFUL CONSOLE credential provider", () => {
        expect(() =>
            createAuthProvider(
                {
                    authenticationMode: "STATEFUL",
                    credentialProvider: "CONSOLE",
                    username: "admin",
                    password: "secret",
                },
                { loadCliConfig: false },
            ),
        ).toThrow(/CONSOLE credential provider is not supported/);
    });

    test("requires username and password for STATEFUL CONFIG auth", () => {
        expect(() =>
            createAuthProvider(
                { authenticationMode: "STATEFUL", username: "admin" },
                { loadCliConfig: false },
            ),
        ).toThrow(/requires .*password/);

        expect(() =>
            createAuthProvider(
                { authenticationMode: "STATEFUL", password: "secret" },
                { loadCliConfig: false },
            ),
        ).toThrow(/requires .*username/);
    });
});

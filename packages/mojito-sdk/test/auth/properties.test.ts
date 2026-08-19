/*
 * properties.test.ts - unit tests for Mojito CLI properties loading
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

import {
    buildBaseUrl,
    connectionConfigFromProperties,
    parseProperties,
    resolveConnectionConfig,
} from "../../src/auth/properties";

describe("parseProperties", () => {
    test("parses keys, ignores comments, supports colon separator", () => {
        const props = parseProperties(`
# comment
l10n.resttemplate.host=example.com
l10n.resttemplate.port: 443
! another comment
`);
        expect(props["l10n.resttemplate.host"]).toBe("example.com");
        expect(props["l10n.resttemplate.port"]).toBe("443");
    });
});

describe("connectionConfigFromProperties", () => {
    test("maps CLI property keys including header maps", () => {
        const config = connectionConfigFromProperties({
            "l10n.resttemplate.scheme": "https",
            "l10n.resttemplate.host": "mojito.example",
            "l10n.resttemplate.port": "443",
            "l10n.resttemplate.authentication-mode": "HEADER",
            "l10n.resttemplate.authentication.username": "alice",
            "l10n.resttemplate.authentication.password": "secret",
            "l10n.resttemplate.header.headers.CF-Access-Client-Id": "id",
            "l10n.resttemplate.header.headers.CF-Access-Client-Secret": "secret2",
        });
        expect(config.scheme).toBe("https");
        expect(config.host).toBe("mojito.example");
        expect(config.port).toBe(443);
        expect(config.authenticationMode).toBe("HEADER");
        expect(config.username).toBe("alice");
        expect(config.headers?.["CF-Access-Client-Id"]).toBe("id");
    });
});

describe("resolveConnectionConfig / buildBaseUrl", () => {
    test("applies defaults without loading CLI files", () => {
        const config = resolveConnectionConfig({}, { loadCliConfig: false });
        expect(config.scheme).toBe("http");
        expect(config.host).toBe("localhost");
        expect(config.port).toBe(8080);
        expect(config.authenticationMode).toBe("STATEFUL");
        expect(buildBaseUrl(config)).toBe("http://localhost:8080");
    });

    test("omits default https port from authority", () => {
        expect(
            buildBaseUrl({
                scheme: "https",
                host: "mojito.example",
                port: 443,
            }),
        ).toBe("https://mojito.example");
    });
});

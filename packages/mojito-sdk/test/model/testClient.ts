/*
 * testClient.ts - shared MojitoClient helper for model unit tests
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

import { MojitoClient } from "../../src/model/MojitoClient";

/**
 * Build a MojitoClient backed by a custom fetch implementation.
 *
 * @param fetchImpl Mock fetch used for assertions.
 */
export function createTestClient(fetchImpl: typeof fetch): MojitoClient {
    return new MojitoClient({
        baseUrl: "http://localhost:8080",
        loadCliConfig: false,
        authenticationMode: "HEADER",
        headers: { "X-Test-Auth": "1" },
        fetchImpl,
    });
}

/**
 * Build a fetch mock that returns JSON and records the last request.
 */
export function createJsonFetch(handler: (url: string, init?: RequestInit) => unknown): {
    fetchImpl: typeof fetch;
    getLastRequest: () => { url: string; init?: RequestInit };
} {
    let lastUrl = "";
    let lastInit: RequestInit | undefined;
    const fetchImpl: typeof fetch = async (input, init) => {
        lastUrl = String(input);
        lastInit = init;
        const payload = handler(lastUrl, init);
        if (payload === undefined) {
            return new Response("", { status: 200 });
        }
        if (typeof payload === "string") {
            return new Response(payload, {
                status: 200,
                headers: { "content-type": "text/plain" },
            });
        }
        return new Response(JSON.stringify(payload), {
            status: 200,
            headers: { "content-type": "application/json" },
        });
    };
    return {
        fetchImpl,
        getLastRequest: () => ({ url: lastUrl, init: lastInit }),
    };
}

/*
 * OpenAIModelAdapter.test.ts
 *
 * Copyright © 2026, JEDLSoft
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

import { OpenAIModelAdapter } from "../src";

/** Node 12 typings omit `fetch`; tests assign a jest mock. */
type FetchHolder = typeof globalThis & { fetch?: jest.Mock };

function getFetchMock(): jest.Mock {
    return (globalThis as FetchHolder).fetch as jest.Mock;
}

function getRequestHeaders(init: unknown): Record<string, string> {
    if (!init || typeof init !== "object") return {};
    const h = (init as { headers?: unknown }).headers;
    if (!h) return {};
    if (typeof h === "object" && h !== null && "forEach" in h) {
        const o: Record<string, string> = {};
        (h as { forEach: (fn: (v: string, k: string) => void) => void }).forEach(
            (v: string, k: string) => {
                o[k] = v;
            }
        );
        return o;
    }
    return h as Record<string, string>;
}

/** Minimal Chat Completions success body (OpenAI API). */
function chatCompletionSuccess(content: string, id = "chatcmpl-test") {
    return {
        id,
        object: "chat.completion",
        choices: [
            {
                index: 0,
                message: { role: "assistant" as const, content },
                finish_reason: "stop",
            },
        ],
    };
}

function httpJsonResponse(status: number, body: unknown, statusText = "OK") {
    const ok = status >= 200 && status < 300;
    const json = async () =>
        typeof body === "string" ? JSON.parse(body) : body;
    const text = async () =>
        typeof body === "string" ? body : JSON.stringify(body);
    return { ok, status, statusText, json, text };
}

/** Minimal successful GET /v1/models?limit=1 body for {@link OpenAIModelAdapter.connect}. */
function connectHandshakeResponse() {
    return httpJsonResponse(200, {
        object: "list",
        data: [{ id: "gpt-4o", object: "model" }],
    });
}

describe("OpenAIModelAdapter", () => {
    const originalFetch = (globalThis as FetchHolder).fetch;

    afterEach(() => {
        (globalThis as FetchHolder).fetch = originalFetch;
        jest.restoreAllMocks();
    });

    describe("constructor", () => {
        test("throws when apiKey is empty or whitespace-only", () => {
            expect(() => new OpenAIModelAdapter({ apiKey: "" })).toThrow(
                /apiKey/
            );
            expect(() => new OpenAIModelAdapter({ apiKey: "   " })).toThrow(
                /apiKey/
            );
        });

        test("accepts apiKey with surrounding whitespace as non-empty", () => {
            const a = new OpenAIModelAdapter({ apiKey: " sk-secret " });
            expect(a.isConfigured()).toBe(true);
        });
    });

    describe("identity and configuration", () => {
        test("getProviderId and getDisplayName", () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            expect(adapter.getProviderId()).toBe("openai");
            expect(adapter.getDisplayName()).toBe("OpenAI");
        });

        test("getCapabilities uses init.defaultModel when set", () => {
            const adapter = new OpenAIModelAdapter({
                apiKey: "sk-x",
                defaultModel: "gpt-4o-mini",
            });
            expect(adapter.getCapabilities().defaultModel).toBe("gpt-4o-mini");
        });

        test("getCapabilities uses built-in default when defaultModel omitted", () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            expect(adapter.getCapabilities().defaultModel).toMatch(/^gpt-/);
        });

        test("getCapabilities: supportsModelListing true (GET /v1/models)", () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            expect(adapter.getCapabilities().supportsModelListing).toBe(true);
        });

        test("isConfigured is false only when apiKey would fail constructor", () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-ok" });
            expect(adapter.isConfigured()).toBe(true);
        });

        test("isConnected is false before connect()", () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            expect(adapter.isConnected()).toBe(false);
        });
    });

    describe("connect", () => {
        test("GET https://api.openai.com/v1/models?limit=1 with Bearer apiKey", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValue(connectHandshakeResponse());
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-handshake" });
            await adapter.connect();
            expect(getFetchMock()).toHaveBeenCalledTimes(1);
            const [url, init] = getFetchMock().mock.calls[0];
            expect(String(url)).toBe(
                "https://api.openai.com/v1/models?limit=1"
            );
            expect((init as { method?: string }).method).toBe("GET");
            expect(getRequestHeaders(init)).toEqual(
                expect.objectContaining({
                    Authorization: "Bearer sk-handshake",
                })
            );
            expect(adapter.isConnected()).toBe(true);
        });

        test("uses init.baseUrl for handshake (no trailing slash)", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValue(connectHandshakeResponse());
            const adapter = new OpenAIModelAdapter({
                apiKey: "sk-x",
                baseUrl: "https://proxy.example.com/",
            });
            await adapter.connect();
            const [url] = getFetchMock().mock.calls[0];
            expect(String(url)).toBe(
                "https://proxy.example.com/v1/models?limit=1"
            );
        });

        test("HTTP 401 on handshake throws", async () => {
            (globalThis as FetchHolder).fetch = jest.fn().mockResolvedValue(
                httpJsonResponse(
                    401,
                    {
                        error: {
                            message: "Incorrect API key",
                            type: "invalid_request_error",
                        },
                    },
                    "Unauthorized"
                )
            );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-bad" });
            await expect(adapter.connect()).rejects.toThrow(/connect failed/i);
            expect(adapter.isConnected()).toBe(false);
        });

        test("second connect() is a no-op (single handshake)", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValue(connectHandshakeResponse());
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await adapter.connect();
            expect(getFetchMock()).toHaveBeenCalledTimes(1);
        });

        test("disconnect() clears session; connect() can run again", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValue(connectHandshakeResponse());
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await adapter.disconnect();
            expect(adapter.isConnected()).toBe(false);
            await adapter.connect();
            expect(getFetchMock()).toHaveBeenCalledTimes(2);
            expect(adapter.isConnected()).toBe(true);
        });
    });

    /**
     * Contract for complete(): POST Chat Completions, map success and HTTP errors.
     * These tests fail until complete() is implemented (they expect real fetch usage and mapping).
     * Each case performs connect() first, then complete() — only the chat POST must establish prompts.
     */
    describe("complete", () => {
        const baseRequest = {
            systemPrompt: "You are a tester.",
            userContent: "Say hi.",
            model: "gpt-4o-2024-08-06",
        };

        test("rejects if connect() was not called", async () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await expect(adapter.complete(baseRequest)).rejects.toThrow(
                /connect\(\) before complete/i
            );
        });

        test("POSTs to https://api.openai.com/v1/chat/completions by default with Bearer apiKey", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("Hello"))
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-test-key" });
            await adapter.connect();
            await adapter.complete(baseRequest);

            expect(getFetchMock()).toHaveBeenCalledTimes(2);
            const [, init] = getFetchMock().mock.calls[1];
            expect(getFetchMock().mock.calls[1][0]).toBe(
                "https://api.openai.com/v1/chat/completions"
            );
            expect(init?.method).toBe("POST");
            expect(getRequestHeaders(init)).toEqual(
                expect.objectContaining({
                    Authorization: "Bearer sk-test-key",
                    "Content-Type": "application/json",
                })
            );
        });

        test("uses init.baseUrl when provided (no trailing slash issues)", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("ok"))
                );
            const adapter = new OpenAIModelAdapter({
                apiKey: "sk-x",
                baseUrl: "https://example.openai-proxy.com",
            });
            await adapter.connect();
            await adapter.complete(baseRequest);
            const [url] = getFetchMock().mock.calls[1];
            expect(String(url)).toContain("example.openai-proxy.com");
            expect(String(url)).toContain("/v1/chat/completions");
        });

        test("request body includes model, system and user messages", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("out"))
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await adapter.complete({
                systemPrompt: "SYS",
                userContent: "USR",
                model: "gpt-4o",
            });
            const [, init] = getFetchMock().mock.calls[1];
            const parsed = JSON.parse((init as { body: string }).body);
            expect(parsed.model).toBe("gpt-4o");
            expect(parsed.messages).toEqual([
                { role: "system", content: "SYS" },
                { role: "user", content: "USR" },
            ]);
        });

        test("includes temperature when parameters.temperature is set", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("x"))
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await adapter.complete({
                ...baseRequest,
                parameters: { temperature: 0.42 },
            });
            const [, init] = getFetchMock().mock.calls[1];
            const parsed = JSON.parse((init as { body: string }).body);
            expect(parsed.temperature).toBe(0.42);
        });

        test("includes max_tokens when parameters.maxTokens is set", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("x"))
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await adapter.complete({
                ...baseRequest,
                parameters: { maxTokens: 256 },
            });
            const [, init] = getFetchMock().mock.calls[1];
            const parsed = JSON.parse((init as { body: string }).body);
            expect(parsed.max_tokens).toBe(256);
        });

        test("successful response maps assistant content to rawContent", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(
                        200,
                        chatCompletionSuccess(
                            "  trimmed answer  ",
                            "chatcmpl-abc"
                        )
                    )
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error).toBeUndefined();
            expect(res.rawContent).toBe("  trimmed answer  ");
            expect(res.providerRequestId).toBe("chatcmpl-abc");
        });

        test("HTTP 401 resolves (or maps) to CompletionResponse with error.httpStatus 401 and message", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(
                        401,
                        {
                            error: {
                                message: "Incorrect API key provided",
                                type: "invalid_request_error",
                            },
                        },
                        "Unauthorized"
                    )
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-bad" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error).toBeDefined();
            expect(res.error?.httpStatus).toBe(401);
            expect(res.error?.message).toMatch(/key|401|Unauthorized|invalid/i);
            expect(res.rawContent).toBe("");
        });

        test("HTTP 429 includes rate limit context in error.message or providerBody", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(
                        429,
                        { error: { message: "Rate limit reached" } },
                        "Too Many Requests"
                    )
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error?.httpStatus).toBe(429);
            expect(res.error?.message).toBeTruthy();
        });

        test("HTTP 500 maps to error with httpStatus 500", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(
                        500,
                        { error: { message: "Internal error" } },
                        "Internal Server Error"
                    )
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error?.httpStatus).toBe(500);
        });

        test("fetch rejection (network failure) on chat rejects or returns error with descriptive message", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockRejectedValueOnce(new Error("ENOTFOUND"));
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            await expect(adapter.complete(baseRequest)).rejects.toThrow(
                /ENOTFOUND|network|fetch/i
            );
        });

        test("200 response with malformed JSON body surfaces error", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    json: async () => {
                        throw new SyntaxError("bad json");
                    },
                    text: async () => "not-json{",
                });
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error).toBeDefined();
            expect(res.error?.message).toBeTruthy();
        });

        test("200 with empty choices array is handled (error or empty rawContent)", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, {
                        id: "x",
                        choices: [],
                    })
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(Boolean(res.error) || res.rawContent === "").toBe(true);
        });

        test("userContent may contain JSON and unicode", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, chatCompletionSuccess("{}"))
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const unicode = JSON.stringify({ t: "日本語" });
            await adapter.complete({
                systemPrompt: "Return JSON",
                userContent: unicode,
                model: "gpt-4o",
            });
            const [, init] = getFetchMock().mock.calls[1];
            const parsed = JSON.parse((init as { body: string }).body);
            expect(parsed.messages[1].content).toBe(unicode);
        });
    });

    /**
     * listAvailableModels should call GET /v1/models and map to ModelInfo[].
     */
    describe("listAvailableModels", () => {
        test("rejects if connect() was not called", async () => {
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await expect(adapter.listAvailableModels()).rejects.toThrow(
                /connect\(\) before listAvailableModels/i
            );
        });

        test("GET /v1/models with Bearer and maps data[].id to ModelInfo.id and displayName", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(200, {
                        object: "list",
                        data: [
                            {
                                id: "gpt-4o",
                                object: "model",
                                created: 1,
                                owned_by: "openai",
                            },
                            {
                                id: "gpt-4o-mini",
                                object: "model",
                                created: 2,
                                owned_by: "openai",
                            },
                        ],
                    })
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(getFetchMock()).toHaveBeenCalledTimes(2);
            const [url, init] = getFetchMock().mock.calls[1];
            expect(String(url)).toMatch(/\/v1\/models$/);
            expect(getRequestHeaders(init)).toEqual(
                expect.objectContaining({ Authorization: "Bearer sk-x" })
            );
            expect(models.map((m) => m.id).sort()).toEqual(
                ["gpt-4o", "gpt-4o-mini"].sort()
            );
            expect(models.every((m) => typeof m.displayName === "string")).toBe(
                true
            );
        });

        test("non-OK list response yields empty ModelInfo[] and must not throw", async () => {
            (globalThis as FetchHolder).fetch = jest
                .fn()
                .mockResolvedValueOnce(connectHandshakeResponse())
                .mockResolvedValueOnce(
                    httpJsonResponse(
                        403,
                        { error: { message: "Forbidden" } },
                        "Forbidden"
                    )
                );
            const adapter = new OpenAIModelAdapter({ apiKey: "sk-x" });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(getFetchMock()).toHaveBeenCalledTimes(2);
            expect(models).toEqual([]);
        });
    });
});

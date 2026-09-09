/*
 * BoxAIModelAdapter.test.ts
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

/*
 * Scenario summary — Box SDK is mocked (`createBoxClientFromInit`); no live Box.
 *
 * Constructor / identity
 *   - No credentials throws (README hint).
 *   - Unset ${VAR} accessToken throws (README hint); does not use the literal.
 *   - accessToken is accepted; provider id/display name; capabilities
 *     (listing + default model); isConfigured; isConnected-before-connect.
 *
 * connect()
 *   - Builds client and calls users.getUserMe().
 *   - Second connect is a no-op; disconnect then connect validates again.
 *   - getUserMe rejection fails connect (not connected).
 *   - Failed client create is not cached; a later connect() retries.
 *
 * complete()
 *   - Rejects if connect() was not called; requires contextFileId.
 *   - createAiTextGen after connect (not as implicit connect).
 *   - Prompt is systemPrompt + userContent; model → basicGen.model.
 *   - temperature / maxTokens mapped; google__ models use google_params.
 *   - SDK answer → rawContent; empty answer → empty rawContent.
 *   - SDK throw → AICompletionError.
 *   - userContent may be JSON/unicode.
 *
 * listAvailableModels()
 *   - Rejects if not connected.
 *   - Maps textGen.basicGen.model (not agent resource id) + displayName.
 *   - Omits agents without a text-gen model; dedupes the same model id.
 *   - Empty entries → [].
 *   - Non-auth failure: warn + [].
 *   - 401/403: log + reject.
 */

import type { BoxClient } from "box-node-sdk";

import { BoxAIModelAdapter } from "../src";
import { createBoxClientFromInit } from "../src/boxClientFactory";

jest.mock("../src/boxClientFactory", () => {
    const actual = jest.requireActual(
        "../src/boxClientFactory"
    ) as typeof import("../src/boxClientFactory");
    return {
        ...actual,
        createBoxClientFromInit: jest.fn(),
    };
});

const mockCreateBoxClient = createBoxClientFromInit as jest.MockedFunction<
    typeof createBoxClientFromInit
>;

/** Minimal {@link import("box-node-sdk").AiResponse}-like success payload. */
function boxAiResponse(answer: string) {
    return {
        answer,
        createdAt: "2026-01-01T00:00:00Z",
    };
}

describe("BoxAIModelAdapter", () => {
    let createAiTextGen: jest.Mock;
    let getAiAgents: jest.Mock;
    let getUserMe: jest.Mock;

    beforeEach(() => {
        createAiTextGen = jest.fn();
        getAiAgents = jest.fn();
        getUserMe = jest.fn().mockResolvedValue({ id: "u1", name: "Me" });
        mockCreateBoxClient.mockResolvedValue({
            ai: { createAiTextGen },
            aiStudio: { getAiAgents },
            users: { getUserMe },
        } as unknown as BoxClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("constructor", () => {
        test("throws when no credentials are provided", () => {
            expect(() => new BoxAIModelAdapter({})).toThrow(/README\.md/);
        });

        test("throws and mentions README when accessToken is an unset ${VAR} placeholder", () => {
            expect(
                () =>
                    new BoxAIModelAdapter({
                        accessToken: "${ILIB_AI_TEST_UNSET_ENV_VAR_DO_NOT_SET}",
                    })
            ).toThrow(/README\.md/);
        });

        test("accepts accessToken", () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            expect(adapter.isConfigured()).toBe(true);
        });
    });

    describe("identity and configuration", () => {
        test("getProviderId and getDisplayName", () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            expect(adapter.getProviderId()).toBe("box-ai");
            expect(adapter.getDisplayName()).toBe("Box AI");
        });

        test("getCapabilities includes supportsModelListing true", () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            const caps = adapter.getCapabilities();
            expect(caps.supportsModelListing).toBe(true);
            expect(caps.defaultModel).toMatch(/gpt|openai|azure/i);
        });

        test("isConfigured is true with accessToken", () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            expect(adapter.isConfigured()).toBe(true);
        });

        test("isConnected is false before connect()", () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            expect(adapter.isConnected()).toBe(false);
        });
    });

    describe("connect", () => {
        test("uses createBoxClientFromInit and users.getUserMe()", async () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            expect(mockCreateBoxClient).toHaveBeenCalledTimes(1);
            expect(getUserMe).toHaveBeenCalledTimes(1);
            expect(adapter.isConnected()).toBe(true);
        });

        test("second connect() does not call getUserMe again", async () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            await adapter.connect();
            expect(getUserMe).toHaveBeenCalledTimes(1);
        });

        test("disconnect() clears session; connect() validates again", async () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            await adapter.disconnect();
            expect(adapter.isConnected()).toBe(false);
            await adapter.connect();
            expect(getUserMe).toHaveBeenCalledTimes(2);
        });

        test("getUserMe rejection fails connect()", async () => {
            getUserMe.mockRejectedValueOnce(new Error("401 from Box"));
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await expect(adapter.connect()).rejects.toThrow(/401 from Box/);
            expect(adapter.isConnected()).toBe(false);
        });

        test("failed createBoxClientFromInit is not cached; connect() can retry", async () => {
            mockCreateBoxClient
                .mockRejectedValueOnce(new Error("JWT parse failed"))
                .mockResolvedValueOnce({
                    ai: { createAiTextGen },
                    aiStudio: { getAiAgents },
                    users: { getUserMe },
                } as unknown as BoxClient);
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await expect(adapter.connect()).rejects.toThrow(/JWT parse failed/);
            expect(adapter.isConnected()).toBe(false);
            await adapter.connect();
            expect(adapter.isConnected()).toBe(true);
            expect(mockCreateBoxClient).toHaveBeenCalledTimes(2);
        });
    });

    /**
     * Contract: {@link BoxAIModelAdapter.complete} uses {@link createBoxClientFromInit},
     * then {@link BoxClient.ai.createAiTextGen} (Box AI text generation). Maps `answer` → `rawContent`.
     */
    describe("complete", () => {
        const baseRequest = {
            systemPrompt: "You are a tester.",
            userContent: "Say hi.",
            model: "azure__openai__gpt_4o_mini",
        };

        /** {@link BoxAIModelAdapter.complete} requires `contextFileId` for `createAiTextGen` items. */
        const boxCompleteInit = {
            accessToken: "box-dev-token",
            contextFileId: "box-file-ctx-test",
        };

        test("rejects if connect() was not called", async () => {
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await expect(adapter.complete(baseRequest)).rejects.toThrow(
                /connect\(\) before complete/i
            );
        });

        test("obtains a client via connect() then calls createAiTextGen (not on first use inside complete as connection)", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("Hello from Box"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await adapter.complete(baseRequest);

            expect(mockCreateBoxClient).toHaveBeenCalled();
            expect(createAiTextGen).toHaveBeenCalledTimes(1);
        });

        test("request includes prompt text derived from systemPrompt and userContent", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("ok"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await adapter.complete({
                systemPrompt: "SYS_LINE",
                userContent: "USR_LINE",
                model: "azure__openai__gpt_4o_mini",
            });

            const firstArg = createAiTextGen.mock.calls[0][0];
            expect(String(firstArg.prompt)).toContain("SYS_LINE");
            expect(String(firstArg.prompt)).toContain("USR_LINE");
        });

        test("selects model via CompletionRequest.model (e.g. ai_agent id / model string)", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("x"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const modelId = "azure__openai__gpt_4o";
            await adapter.complete({
                ...baseRequest,
                model: modelId,
            });

            const body = createAiTextGen.mock.calls[0][0];
            const agent = body.aiAgent as {
                type?: string;
                basicGen?: { model?: string };
            };
            expect(agent).toBeDefined();
            expect(agent.type).toBe("ai_agent_text_gen");
            expect(agent.basicGen?.model).toBe(modelId);
        });

        test("maps temperature and maxTokens into the Box text-gen agent override", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("x"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await adapter.complete({
                ...baseRequest,
                parameters: {
                    temperature: 0.25,
                    maxTokens: 512,
                },
            });

            const basicGen = createAiTextGen.mock.calls[0][0].aiAgent.basicGen;
            expect(basicGen.numTokensForCompletion).toBe(512);
            expect(basicGen.llmEndpointParams).toEqual({
                type: "openai_params",
                temperature: 0.25,
            });
        });

        test("uses provider-specific endpoint params for Box model ids", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("x"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await adapter.complete({
                ...baseRequest,
                model: "google__gemini_2_5_flash",
                parameters: { temperature: 0.5 },
            });

            const basicGen = createAiTextGen.mock.calls[0][0].aiAgent.basicGen;
            expect(basicGen.llmEndpointParams).toEqual({
                type: "google_params",
                temperature: 0.5,
            });
        });

        test("maps SDK answer to rawContent", async () => {
            createAiTextGen.mockResolvedValue(
                boxAiResponse("  boxed answer  ")
            );
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.rawContent).toBe("  boxed answer  ");
        });

        /**
         * Per-request failures (e.g. AI endpoint 403) can still occur after a successful
         * {@link connect}. This asserts `complete()` propagates the SDK error from `createAiTextGen`.
         */
        test("SDK rejection surfaces as AICompletionError", async () => {
            createAiTextGen.mockRejectedValue(
                new Error("Box SDK: unauthorized")
            );
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await expect(adapter.complete(baseRequest)).rejects.toMatchObject({
                name: "AICompletionError",
                message: "Box SDK: unauthorized",
            });
        });

        test("empty answer yields empty rawContent", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse(""));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.rawContent).toBe("");
        });

        test("userContent may contain JSON and unicode", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse("{}"));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const unicode = JSON.stringify({ t: "日本語" });
            await adapter.complete({
                systemPrompt: "Return JSON",
                userContent: unicode,
                model: "azure__openai__gpt_4o_mini",
            });
            const body = createAiTextGen.mock.calls[0][0];
            expect(String(body.prompt)).toContain("日本語");
        });
    });

    /**
     * Contract: {@link BoxAIModelAdapter.listAvailableModels} uses the Box client (e.g.
     * {@link BoxClient.aiStudio.getAiAgents}) and maps agents to {@link ModelInfo}.
     */
    describe("listAvailableModels", () => {
        test("rejects if connect() was not called", async () => {
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await expect(adapter.listAvailableModels()).rejects.toThrow(
                /connect\(\) before listAvailableModels/i
            );
        });

        test("calls getAiAgents and maps entries to ModelInfo (id + displayName)", async () => {
            getAiAgents.mockResolvedValue({
                entries: [
                    {
                        id: "agent-1",
                        type: "ai_agent",
                        name: "My text agent",
                        textGen: {
                            type: "ai_agent_text_gen",
                            accessState: "enabled",
                            description: "desc",
                            basicGen: {
                                model: "azure__openai__gpt_4o_mini",
                            },
                        },
                    },
                ],
            });

            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();

            expect(mockCreateBoxClient).toHaveBeenCalled();
            expect(getAiAgents).toHaveBeenCalled();
            expect(models).toEqual([
                {
                    id: "azure__openai__gpt_4o_mini",
                    displayName: "My text agent",
                },
            ]);
        });

        test("omits agents that have no textGen.basicGen.model", async () => {
            getAiAgents.mockResolvedValue({
                entries: [
                    {
                        id: "agent-ask-only",
                        name: "Ask only",
                    },
                    {
                        id: "agent-2",
                        name: "Text gen",
                        textGen: {
                            basicGen: { model: "azure__openai__gpt_4o" },
                        },
                    },
                ],
            });
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(models.map((m) => m.id)).toEqual(["azure__openai__gpt_4o"]);
            expect(models.some((m) => m.id === "agent-ask-only")).toBe(false);
        });

        test("deduplicates the same text-gen model used by multiple agents", async () => {
            getAiAgents.mockResolvedValue({
                entries: [
                    {
                        id: "agent-a",
                        name: "First",
                        textGen: {
                            basicGen: { model: "azure__openai__gpt_4o_mini" },
                        },
                    },
                    {
                        id: "agent-b",
                        name: "Second",
                        textGen: {
                            basicGen: { model: "azure__openai__gpt_4o_mini" },
                        },
                    },
                ],
            });
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(models).toEqual([
                {
                    id: "azure__openai__gpt_4o_mini",
                    displayName: "First",
                },
            ]);
        });

        test("empty entries yields empty array", async () => {
            getAiAgents.mockResolvedValue({ entries: [] });
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(models).toEqual([]);
        });

        test("non-auth getAiAgents failure logs and resolves to an empty array", async () => {
            const warn = jest.spyOn(console, "warn").mockImplementation();
            getAiAgents.mockRejectedValue(new Error("network down"));
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(Array.isArray(models)).toBe(true);
            expect(models).toEqual([]);
            expect(warn).toHaveBeenCalled();
        });

        test("auth getAiAgents failure logs and rejects", async () => {
            const error = jest.spyOn(console, "error").mockImplementation();
            const authError = Object.assign(new Error("Forbidden"), {
                responseInfo: { statusCode: 403 },
            });
            getAiAgents.mockRejectedValue(authError);
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            await expect(adapter.listAvailableModels()).rejects.toBe(authError);
            expect(error).toHaveBeenCalled();
        });
    });
});

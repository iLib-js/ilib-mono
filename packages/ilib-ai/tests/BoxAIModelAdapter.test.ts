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
    });

    describe("constructor", () => {
        test("throws when no credentials are provided", () => {
            expect(() => new BoxAIModelAdapter({})).toThrow();
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
            expect(caps.supportsStructuredOutput).toBe(false);
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

        test("maps SDK answer to rawContent and sets isStructuredOutput false", async () => {
            createAiTextGen.mockResolvedValue(
                boxAiResponse("  boxed answer  ")
            );
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.error).toBeUndefined();
            expect(res.rawContent).toBe("  boxed answer  ");
            expect(res.isStructuredOutput).toBe(false);
        });

        /**
         * Per-request failures (e.g. AI endpoint 403) can still occur after a successful
         * {@link connect}. This asserts `complete()` propagates the SDK error from `createAiTextGen`.
         */
        test("SDK rejection surfaces with the SDK error message (not a generic stub)", async () => {
            createAiTextGen.mockRejectedValue(
                new Error("Box SDK: unauthorized")
            );
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            await expect(adapter.complete(baseRequest)).rejects.toThrow(
                "Box SDK: unauthorized"
            );
        });

        test("empty answer yields empty rawContent or explicit error — must be consistent", async () => {
            createAiTextGen.mockResolvedValue(boxAiResponse(""));
            const adapter = new BoxAIModelAdapter(boxCompleteInit);
            await adapter.connect();
            const res = await adapter.complete(baseRequest);
            expect(res.rawContent === "" || res.error).toBeTruthy();
            expect(res.isStructuredOutput).toBe(false);
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
            expect(models.length).toBeGreaterThanOrEqual(1);
            expect(
                models.some(
                    (m) =>
                        m.id === "azure__openai__gpt_4o_mini" ||
                        m.id === "agent-1"
                )
            ).toBe(true);
            expect(models.every((m) => typeof m.displayName === "string")).toBe(
                true
            );
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

        test("getAiAgents rejection resolves to empty array (no unhandled throw)", async () => {
            getAiAgents.mockRejectedValue(new Error("network down"));
            const adapter = new BoxAIModelAdapter({
                accessToken: "box-dev-token",
            });
            await adapter.connect();
            const models = await adapter.listAvailableModels();
            expect(Array.isArray(models)).toBe(true);
            expect(models).toEqual([]);
        });
    });
});

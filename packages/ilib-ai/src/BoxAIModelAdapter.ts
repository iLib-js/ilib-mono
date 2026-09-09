/*
 * BoxAIModelAdapter.ts — Box AI adapter (via Box Node SDK)
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
import { AIModelAdapter } from "./AIModelAdapter";
import type { BoxAIModelInitOptions } from "./BoxAIModelInitOptions";
import {
    assertBoxInitConfigured,
    createBoxClientFromInit,
    isBoxInitConfigured,
} from "./boxClientFactory";
import { BOX_AI_ADAPTER_NAME } from "./constants";
import { AICompletionError } from "./types";
import type {
    AdapterCapabilities,
    CompletionRequest,
    CompletionResponse,
    ModelInfo,
} from "./types";

const DEFAULT_BOX_MODEL = "azure__openai__gpt_4o_mini";

function getBoxHttpStatus(err: unknown): number | undefined {
    if (!err || typeof err !== "object") {
        return undefined;
    }
    const responseInfo = (err as {
        responseInfo?: { statusCode?: unknown };
    }).responseInfo;
    return typeof responseInfo?.statusCode === "number"
        ? responseInfo.statusCode
        : undefined;
}

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

type BoxEndpointParamsType =
    | "openai_params"
    | "google_params"
    | "aws_params"
    | "ibm_params";

function getBoxEndpointParamsType(model: string): BoxEndpointParamsType {
    const provider = model.split("__", 1)[0].toLowerCase();
    switch (provider) {
        case "google":
            return "google_params";
        case "aws":
            return "aws_params";
        case "ibm":
            return "ibm_params";
        default:
            // Includes openai__, azure__openai__, and OpenAI-compatible models.
            return "openai_params";
    }
}

/**
 * Box AI–backed adapter using the official **[Box Node SDK](https://github.com/box/box-node-sdk)**.
 * Initialization options are defined by {@link BoxAIModelInitOptions}.
 *
 * **Connection:** Call {@link connect} before {@link complete}. {@link connect} builds the
 * {@link BoxClient} and validates credentials with **GET `/2.0/users/me`** (`users.getUserMe()`).
 * The same client is reused for every {@link complete} until {@link disconnect}.
 *
 * **Completions** require **`contextFileId`** in init (Box `createAiTextGen` needs a file context item).
 *
 * @see {@link BoxAIModelInitOptions} for authentication and Box Platform fields.
 * @see {@link https://developer.box.com/sdks-and-tools Box SDKs & tools}
 *
 * **Model discovery:** Uses **`BoxClient.aiStudio.getAiAgents()`** (`GET /2.0/ai_agents`).
 * Only agents with a text-gen **model API name** (`textGen.basicGen.model`) are listed;
 * agent resource ids are omitted because {@link complete} sends that string as `basicGen.model`.
 * Duplicate model ids are collapsed to one {@link ModelInfo}.
 */
export class BoxAIModelAdapter extends AIModelAdapter {
    private readonly init: BoxAIModelInitOptions;
    private clientPromise: Promise<BoxClient> | null = null;

    /** Set after a successful {@link connect}; cleared by {@link disconnect}. */
    private sessionActive = false;

    constructor(init: BoxAIModelInitOptions) {
        super();
        assertBoxInitConfigured(init);
        this.init = { ...init };
    }

    getProviderId(): string {
        return BOX_AI_ADAPTER_NAME;
    }

    getDisplayName(): string {
        return "Box AI";
    }

    getCapabilities(): AdapterCapabilities {
        return {
            supportsModelListing: true,
            defaultModel: DEFAULT_BOX_MODEL,
            maxConcurrentRequests: 20,
        };
    }

    isConfigured(): boolean {
        return isBoxInitConfigured(this.init);
    }

    override isConnected(): boolean {
        return this.sessionActive;
    }

    /**
     * Builds a {@link BoxClient}, then validates the token with **users.getUserMe()**.
     */
    override async connect(): Promise<void> {
        if (this.sessionActive) {
            return;
        }
        const client = await this.getClient();
        await client.users.getUserMe();
        this.sessionActive = true;
    }

    override async disconnect(): Promise<void> {
        this.sessionActive = false;
        this.clientPromise = null;
    }

    /**
     * Lazily creates the Box client. Used by {@link connect}, {@link complete}, and
     * {@link listAvailableModels} — the same promise is reused until {@link disconnect}.
     * A rejected create is not cached, so a later {@link connect} can retry.
     */
    protected async getClient(): Promise<BoxClient> {
        if (!this.clientPromise) {
            this.clientPromise = createBoxClientFromInit(this.init).catch(
                (err) => {
                    this.clientPromise = null;
                    throw err;
                }
            );
        }
        return this.clientPromise;
    }

    override async listAvailableModels(): Promise<ModelInfo[]> {
        if (!this.sessionActive) {
            return Promise.reject(
                new Error(
                    "BoxAIModelAdapter: call connect() before listAvailableModels()"
                )
            );
        }
        const client = await this.getClient();
        try {
            const res = await client.aiStudio.getAiAgents();
            const entries = res.entries ?? [];
            const out: ModelInfo[] = [];
            const seen = new Set<string>();
            for (const e of entries) {
                const row = e as {
                    name?: string;
                    textGen?: { basicGen?: { model?: string } };
                };
                const modelId = row.textGen?.basicGen?.model?.trim();
                if (!modelId || seen.has(modelId)) {
                    continue;
                }
                seen.add(modelId);
                out.push({
                    id: modelId,
                    displayName: row.name ?? modelId,
                });
            }
            return out;
        } catch (err) {
            const status = getBoxHttpStatus(err);
            const message = `BoxAIModelAdapter.listAvailableModels failed${
                status ? ` with HTTP ${status}` : ""
            }: ${getErrorMessage(err)}`;
            if (status === 401 || status === 403) {
                console.error(message);
                throw err;
            }
            console.warn(message);
            return [];
        }
    }

    override async complete(
        request: CompletionRequest
    ): Promise<CompletionResponse> {
        if (!this.sessionActive) {
            return Promise.reject(
                new Error("BoxAIModelAdapter: call connect() before complete()")
            );
        }
        const fileId = this.init.contextFileId?.trim();
        if (!fileId) {
            return Promise.reject(
                new Error(
                    "BoxAIModelAdapter: set contextFileId in BoxAIModelInitOptions for complete()"
                )
            );
        }
        const prompt = `${request.systemPrompt}\n\n${request.userContent}`;
        const client = await this.getClient();
        const parameters = request.parameters;
        try {
            const out = await client.ai.createAiTextGen({
                prompt,
                items: [{ type: "file", id: fileId }],
                aiAgent: {
                    type: "ai_agent_text_gen",
                    basicGen: {
                        model: request.model,
                        ...(parameters?.maxTokens !== undefined
                            ? {
                                  numTokensForCompletion: parameters.maxTokens,
                              }
                            : {}),
                        ...(parameters?.temperature !== undefined
                            ? {
                                  llmEndpointParams: {
                                      type: getBoxEndpointParamsType(
                                          request.model
                                      ),
                                      temperature: parameters.temperature,
                                  },
                              }
                            : {}),
                    },
                },
            });
            const answer = out.answer ?? "";
            return {
                rawContent: answer,
            };
        } catch (err) {
            if (err instanceof AICompletionError) {
                throw err;
            }
            const status = getBoxHttpStatus(err);
            throw new AICompletionError(getErrorMessage(err), {
                httpStatus: status,
            });
        }
    }
}

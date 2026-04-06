/*
 * AIModelAdapter.ts — abstract adapter for AI providers
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

import type {
    AdapterCapabilities,
    CompletionRequest,
    CompletionResponse,
    ModelInfo,
} from "./types";

/**
 * Interface-like abstract base for provider-specific AI adapters.
 * Callers usually obtain instances via {@link createAIModelAdapter} rather than `new` on subclasses.
 *
 * **Session:** Constructing an adapter only stores **configuration** (keys, paths, base URLs).
 * Call {@link connect} once before {@link complete} (and before network-backed
 * {@link listAvailableModels} where applicable) so credentials are validated with the provider
 * and clients/sessions are created once; further completions reuse that connection.
 */
export abstract class AIModelAdapter {
    abstract getProviderId(): string;

    abstract getDisplayName(): string;

    abstract getCapabilities(): AdapterCapabilities;

    /**
     * Whether required credentials and options are present for this adapter.
     */
    abstract isConfigured(): boolean;

    /**
     * Validates credentials with the provider and prepares the adapter for {@link complete}.
     * Call after construction, before any completions. **Idempotent:** if already connected,
     * resolves immediately. Use {@link disconnect} to tear down so the next {@link connect}
     * performs a fresh handshake.
     */
    abstract connect(): Promise<void>;

    /**
     * Whether {@link connect} completed successfully since the last {@link disconnect}.
     */
    abstract isConnected(): boolean;

    /**
     * Clears connection state (sessions, cached SDK clients). Default: no-op.
     * After this, call {@link connect} again before {@link complete}.
     */
    disconnect(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Run a single completion. Subclasses map this to OpenAI, Box AI, etc.
     * Requires a prior successful {@link connect}; does not establish new connections.
     */
    abstract complete(request: CompletionRequest): Promise<CompletionResponse>;

    /**
     * Returns LLM models available to this adapter/account (may require network I/O).
     * Default: empty list. Override when {@link AdapterCapabilities.supportsModelListing} is true.
     */
    listAvailableModels(): Promise<ModelInfo[]> {
        return Promise.resolve([]);
    }
}

/*
 * types.ts - provider-agnostic request/response types for AI completions
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

/**
 * Optional generation and transport tuning for a single {@link CompletionRequest}.
 * Adapters map these to provider-specific parameters (e.g. OpenAI `temperature`, `max_tokens`).
 */
export interface CompletionParameters {
    /**
     * Sampling temperature; higher values increase randomness. Semantics are provider-defined.
     * Omit to use the provider or adapter default.
     */
    temperature?: number;
    /**
     * Upper bound on the number of **completion** tokens to generate (not necessarily total context).
     * Semantics are provider-defined. Omit for provider default.
     */
    maxTokens?: number;
    /**
     * Maximum time to wait for this request to finish, in **milliseconds**.
     * Adapters may map this to HTTP client timeouts or SDK deadlines.
     */
    timeoutMs?: number;
}

/**
 * A single, normalized request to run one LLM completion through an {@link import("./AIModelAdapter").AIModelAdapter}.
 *
 * **Prompt shape:** The full input you intend for the model is represented by **`systemPrompt` together with
 * `userContent`**—there is no separate hidden prompt field. Conceptually that is the whole prompt; however,
 * these are **two distinct strings**, not a single concatenated field. That lets adapters map them to APIs that
 * distinguish **system** vs **user** roles (e.g. OpenAI chat messages with `role: "system"` and `role: "user"`).
 * A provider that only accepts one blob may combine them inside the adapter; **ilib-ai** does not require or
 * define string concatenation here.
 *
 * The library does not parse `userContent`; callers own structure (e.g. JSON) and meaning.
 *
 * **Images and multimodal inputs** are not part of this type in the initial release—only these text fields.
 */
export interface CompletionRequest {
    /**
     * Instruction / system text: role, output format, safety rules, or other constraints for this call.
     */
    systemPrompt: string;
    /**
     * User-facing payload: plain text or a string you serialize yourself (often JSON).
     * The adapter forwards it; **ilib-ai** does not interpret or validate it.
     */
    userContent: string;
    /**
     * **LLM** identifier for this call (e.g. OpenAI model name, Box `ai_agent` model string).
     * This is **not** the adapter id (`openai` vs `box-ai`); it selects which model the provider runs.
     */
    model: string;
    /**
     * Optional sampling, token limit, and timeout. Omitted fields use adapter or provider defaults.
     */
    parameters?: CompletionParameters;
}

/**
 * Describes a **transport- or SDK-level** failure (HTTP error, network error, SDK exception)
 * when the adapter chooses to return a structured result instead of rejecting the promise.
 * @see {@link CompletionResponse.error}
 */
export interface CompletionResponseError {
    /**
     * Human-readable explanation suitable for logs or UI. Should not embed raw secrets.
     */
    message: string;
    /**
     * HTTP status code when the failure was returned from an HTTP API (e.g. `401`, `429`, `500`).
     * Omitted for non-HTTP failures (e.g. DNS, TLS, or pure SDK errors).
     */
    httpStatus?: number;
    /**
     * HTTP reason phrase or status text when available (e.g. `"Unauthorized"`).
     */
    httpStatusText?: string;
    /**
     * Optional raw response body substring, or a stringified provider error payload, for debugging.
     * **Do not** log in production if it may contain tokens or PII; adapters should redact when possible.
     */
    providerBody?: string;
}

/**
 * Normalized result of {@link import("./AIModelAdapter").AIModelAdapter.complete}.
 * On success, `rawContent` holds model output and `error` is usually omitted.
 * On failure, the adapter may set `error` and leave `rawContent` empty or omit success-only fields.
 */
export interface CompletionResponse {
    /**
     * Raw text returned by the model on **success** (JSON, markdown, plain text, etc.).
     * May be an empty string when the provider returns no text or when only {@link error} is meaningful.
     * The **caller** parses or validates this string (e.g. JSON.parse).
     */
    rawContent: string;
    /**
     * Optional identifier for correlation or support (e.g. `x-request-id`, provider trace id).
     */
    providerRequestId?: string;
    /**
     * `true` if this response path **guaranteed** structured output (e.g. strict JSON schema from the API).
     * `false` for plain or best-effort text (typical for Box AI `answer`-style responses).
     */
    isStructuredOutput: boolean;
    /**
     * Set when the adapter reports a transport/SDK failure in-band instead of throwing.
     * When present, inspect {@link CompletionResponseError.message} and optional HTTP fields.
     */
    error?: CompletionResponseError;
}

/**
 * Static capability flags for an adapter instance. Used to choose UI options (e.g. whether to show
 * “list models”, structured output). These are **not** a live catalog of model names; use
 * {@link import("./AIModelAdapter").AIModelAdapter.listAvailableModels} for that.
 *
 * **Image / multimodal inputs are not supported** in this initial version; only text (`systemPrompt` +
 * `userContent`). Batch APIs are also **not** supported; use repeated {@link import("./AIModelAdapter").AIModelAdapter.complete} calls for bulk work.
 */
export interface AdapterCapabilities {
    /**
     * Whether the provider can **enforce** structured output (e.g. JSON schema) for this adapter path.
     */
    supportsStructuredOutput: boolean;
    /**
     * Whether this adapter’s provider exposes a way to **discover** LLM ids for this account (e.g. OpenAI
     * `GET /v1/models`, Box **`GET /2.0/ai_agents`** via `BoxClient.aiStudio.getAiAgents()`). If `true`,
     * {@link import("./AIModelAdapter").AIModelAdapter.listAvailableModels} should eventually return real data;
     * it may still return `[]` until implemented or when the provider returns no models.
     */
    supportsModelListing: boolean;
    /**
     * Suggested **LLM** id when the caller omits `model` on a request; provider-specific string.
     */
    defaultModel: string;
    /**
     * Hint for how many concurrent {@link import("./AIModelAdapter").AIModelAdapter.complete} calls
     * the integration is comfortable with (rate limits, pool size). Adapters may ignore this.
     */
    maxConcurrentRequests: number;
}

/**
 * One entry in a list returned by {@link import("./AIModelAdapter").AIModelAdapter.listAvailableModels}
 * for UIs or configuration (id + display label).
 */
export interface ModelInfo {
    /**
     * Provider-specific **LLM** id string (same vocabulary as {@link CompletionRequest.model} for that provider).
     */
    id: string;
    /**
     * Short human-readable label for pickers (may match `id` or a marketing name).
     */
    displayName: string;
}

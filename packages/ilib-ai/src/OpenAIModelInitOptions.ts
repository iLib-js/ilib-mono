/*
 * OpenAIModelInitOptions.ts — initialization parameters for OpenAIModelAdapter
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
 * Initialization parameters for {@link OpenAIModelAdapter}.
 *
 * Calls the OpenAI HTTP APIs (ChatGPT and compatible endpoints) using an API key.
 */
export interface OpenAIModelInitOptions {
    /**
     * OpenAI API key used as `Authorization: Bearer`.
     * Environment placeholders such as `${OPENAI_API_KEY}` are **not** resolved here; pass the resolved string from your config layer.
     */
    apiKey: string;
    /** Override the default host (default: `https://api.openai.com`). */
    baseUrl?: string;
    /** Default model id when a {@link CompletionRequest} omits `model`. */
    defaultModel?: string;
}

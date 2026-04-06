/*
 * index.ts — public exports for ilib-ai
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

export { AIModelAdapter } from "./AIModelAdapter";
export { BoxAIModelAdapter } from "./BoxAIModelAdapter";
export type {
    BoxAIModelInitOptions,
    BoxDeveloperJwtConfig,
} from "./BoxAIModelInitOptions";
export { OpenAIModelAdapter } from "./OpenAIModelAdapter";
export type { OpenAIModelInitOptions } from "./OpenAIModelInitOptions";
export {
    BOX_AI_ADAPTER_NAME,
    OPENAI_ADAPTER_NAME,
    type KnownAIModelAdapterName,
} from "./constants";
export {
    createAIModelAdapter,
    listKnownAIModelAdapterNames,
} from "./factory";
export type {
    AdapterCapabilities,
    CompletionParameters,
    CompletionRequest,
    CompletionResponse,
    CompletionResponseError,
    ModelInfo,
} from "./types";

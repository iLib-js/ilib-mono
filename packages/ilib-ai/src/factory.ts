/*
 * factory.ts — construct built-in AI model adapters by name
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

import { AIModelAdapter } from "./AIModelAdapter";
import { BoxAIModelAdapter } from "./BoxAIModelAdapter";
import type { BoxAIModelInitOptions } from "./BoxAIModelInitOptions";
import {
    BOX_AI_ADAPTER_NAME,
    OPENAI_ADAPTER_NAME,
    type KnownAIModelAdapterName,
} from "./constants";
import { OpenAIModelAdapter } from "./OpenAIModelAdapter";
import type { OpenAIModelInitOptions } from "./OpenAIModelInitOptions";

/**
 * Returns every built-in **adapter** id accepted by {@link createAIModelAdapter}.
 */
export function listKnownAIModelAdapterNames(): readonly KnownAIModelAdapterName[] {
    return [OPENAI_ADAPTER_NAME, BOX_AI_ADAPTER_NAME];
}

export function createAIModelAdapter(
    name: typeof OPENAI_ADAPTER_NAME,
    init: OpenAIModelInitOptions
): OpenAIModelAdapter;
export function createAIModelAdapter(
    name: typeof BOX_AI_ADAPTER_NAME,
    init: BoxAIModelInitOptions
): BoxAIModelAdapter;
/** Fallback overload for dynamic adapter ids (unknown ids throw at runtime). */
export function createAIModelAdapter(name: string, init: unknown): AIModelAdapter;
export function createAIModelAdapter(name: string, init: unknown): AIModelAdapter {
    if (name === OPENAI_ADAPTER_NAME) {
        return new OpenAIModelAdapter(init as OpenAIModelInitOptions);
    }
    if (name === BOX_AI_ADAPTER_NAME) {
        return new BoxAIModelAdapter(init as BoxAIModelInitOptions);
    }
    throw new Error(`Unknown AI model adapter: ${name}`);
}

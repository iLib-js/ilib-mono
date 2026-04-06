/*
 * constants.ts — known adapter ids for the factory
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

/** Factory id for {@link OpenAIModelAdapter}. */
export const OPENAI_ADAPTER_NAME = "openai" as const;

/** Factory id for {@link BoxAIModelAdapter}. */
export const BOX_AI_ADAPTER_NAME = "box-ai" as const;

/** Union of built-in factory adapter ids. */
export type KnownAIModelAdapterName =
    | typeof OPENAI_ADAPTER_NAME
    | typeof BOX_AI_ADAPTER_NAME;

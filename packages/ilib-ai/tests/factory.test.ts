/*
 * factory.test.ts
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

import {
    BOX_AI_ADAPTER_NAME,
    createAIModelAdapter,
    listKnownAIModelAdapterNames,
    OPENAI_ADAPTER_NAME,
} from "../src";

describe("factory", () => {
    test("listKnownAIModelAdapterNames returns openai and box-ai", () => {
        const names = listKnownAIModelAdapterNames();
        expect(names).toContain(OPENAI_ADAPTER_NAME);
        expect(names).toContain(BOX_AI_ADAPTER_NAME);
        expect(names.length).toBe(2);
    });

    test("createAIModelAdapter throws for unknown adapter id", () => {
        expect(() =>
            createAIModelAdapter("unknown-provider", {})
        ).toThrow(/Unknown AI model adapter/);
    });

    test("createAIModelAdapter returns OpenAIModelAdapter for openai", () => {
        const adapter = createAIModelAdapter(OPENAI_ADAPTER_NAME, {
            apiKey: "sk-test",
        });
        expect(adapter.getProviderId()).toBe(OPENAI_ADAPTER_NAME);
    });

    test("createAIModelAdapter returns BoxAIModelAdapter for box-ai", () => {
        const adapter = createAIModelAdapter(BOX_AI_ADAPTER_NAME, {
            accessToken: "box-test-token",
        });
        expect(adapter.getProviderId()).toBe(BOX_AI_ADAPTER_NAME);
    });

    test("createAIModelAdapter propagates OpenAI init validation errors", () => {
        expect(() =>
            createAIModelAdapter(OPENAI_ADAPTER_NAME, { apiKey: "" })
        ).toThrow(/apiKey/);
    });

    test("createAIModelAdapter propagates Box init validation errors", () => {
        expect(() =>
            createAIModelAdapter(BOX_AI_ADAPTER_NAME, {})
        ).toThrow();
    });
});

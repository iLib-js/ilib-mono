# ilib-ai

**ilib-ai** is a **TypeScript** library for **calling AI providers**: you supply prompts and options; the library returns the **raw model output** (or structured **error** information when a call fails at the transport/SDK layer). **Designing prompts and interpreting successful `rawContent` is up to you** — there are no built-in translation or lint workflows.

It lives in the [iLib-js ilib-mono](https://github.com/iLib-js/ilib-mono) repository. Design details are in [**Architecture.md** on GitHub](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-ai/Architecture.md) (that file is **not** shipped on npm; clone or browse the repo to read it).

---

## Installation

From **your application or package root** (where your `package.json` lives), add the dependency:

```bash
npm install ilib-ai
```

```bash
pnpm add ilib-ai
```

```bash
yarn add ilib-ai
```

**Requirements:** Node.js version range in `engines` in [package.json](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-ai/package.json).

---

## What you get

- **`AIModelAdapter`** — abstract, interface-like type for `complete`, capabilities, configuration checks, and **async** listing of **LLM** models available to that adapter (where supported).
- **Built-in implementations** for **OpenAI** and **Box AI** (Box uses the official [Box Node SDK](https://github.com/box/box-node-sdk); see [Box SDKs & tools](https://developer.box.com/sdks-and-tools)).
- **`createAIModelAdapter(name, init)`** — factory that returns a concrete **adapter**. **`name`** selects the **integration** (`openai`, `box-ai`, …), not a specific LLM product. **`init`** is **typed per provider** (see TSDoc on **`OpenAIModelInitOptions`**, **`BoxAIModelInitOptions`**, and the subclasses). **Throws** if the name is unknown or initialization fails.
- **`listKnownAIModelAdapterNames()`** — returns every **built-in adapter id** string this version ships (which integrations exist). It does **not** list LLM models; those depend on the provider and your account (see below).
- **`CompletionRequest.model`** — which **LLM** to run for that request (e.g. OpenAI model id or Box model string). A **Box AI** adapter can call **many** models; Box defines which ids are valid for your tenant and subscription.
- **Text-only prompts** in this initial release (`systemPrompt` + `userContent`). Image and multimodal inputs are not supported yet.

---

## Usage (illustrative)

The exact exports and option field names follow the TypeScript API and TSDoc. Prefer **`createAIModelAdapter`** so the integration choice stays a single entry point.

### Plain JavaScript (Node)

The compiled package is CommonJS (`require`). You can use the same API without TypeScript—omit type annotations and use string keys as in your `init` objects:

```javascript
const {
  createAIModelAdapter,
  OPENAI_ADAPTER_NAME,
} = require("ilib-ai");

async function run() {
  const ai = createAIModelAdapter(OPENAI_ADAPTER_NAME, {
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { rawContent, error } = await ai.complete({
    systemPrompt: "You are a helpful assistant.",
    userContent: "Say hello in one sentence.",
    model: "gpt-4o-2024-08-06",
    parameters: { temperature: 0.3 },
  });

  if (error) {
    console.error(error.message);
    return;
  }
  console.log(rawContent);
}

run().catch(console.error);
```

If your project uses **ES modules** (`"type": "module"`), use `import` instead of `require`; the calls are the same as in the TypeScript examples below.

### List built-in **adapter** names (integrations)

```typescript
import { listKnownAIModelAdapterNames } from "ilib-ai";

const adapterIds = listKnownAIModelAdapterNames();
// e.g. ["openai", "box-ai"] — see implementation for current values
```

### OpenAI

```typescript
import { createAIModelAdapter, OPENAI_ADAPTER_NAME } from "ilib-ai";

const ai = createAIModelAdapter(OPENAI_ADAPTER_NAME, {
  apiKey: process.env.OPENAI_API_KEY!,
  // baseUrl, defaultModel hint, … — see OpenAIModelInitOptions TSDoc
});

const { rawContent, isStructuredOutput, error } = await ai.complete({
  systemPrompt: "You are a helpful assistant. Reply with valid JSON only.",
  userContent: JSON.stringify({ task: "greet", language: "es" }),
  model: "gpt-4o-2024-08-06",
  parameters: { temperature: 0.2 },
});

if (error) {
  // e.g. error.httpStatus, error.message — see CompletionResponse TSDoc
} else {
  const parsed = JSON.parse(rawContent);
}
```

### Box AI

```typescript
import { createAIModelAdapter, BOX_AI_ADAPTER_NAME } from "ilib-ai";

const ai = createAIModelAdapter(BOX_AI_ADAPTER_NAME, {
  accessToken: process.env.BOX_ACCESS_TOKEN!,
  // Or pass the Developer Console JWT JSON as `boxDeveloperJwtConfig`, or use
  // `configPath` / flat JWT fields — see BoxAIModelInitOptions TSDoc
});

const { rawContent, isStructuredOutput, error } = await ai.complete({
  systemPrompt: "You help with product copy.",
  userContent: "Rewrite this headline to be shorter: …",
  model: "azure__openai__gpt_4o_mini",
});
```

### List **LLM** models available to an adapter (async)

```typescript
const models = await ai.listAvailableModels();
// May be empty if unsupported or not yet implemented — see Architecture.md
```

### Capabilities

```typescript
const caps = ai.getCapabilities();
if (caps.supportsModelListing) {
  const models = await ai.listAvailableModels();
}
```

---

## API reference (TypeDoc)

The package is documented with **TypeDoc** from TypeScript sources (same general approach as [ilib-po](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-po)). After installing the package (or in a monorepo clone), generate HTML (and optional Markdown) from the package directory:

```bash
cd node_modules/ilib-ai   # or packages/ilib-ai in ilib-mono
pnpm doc
```

Open the generated files under `docs/` (e.g. `docs/index.html`). **Subclass initialization** parameters are described in **TSDoc** on **`OpenAIModelAdapter`**, **`BoxAIModelAdapter`**, and the corresponding **`OpenAIModelInitOptions`** / **`BoxAIModelInitOptions`** types.

---

## Optional integration tests (real APIs)

Integration tests that call **live** APIs are **optional** and are **not** part of default CI for this repo.

From the **ilib-ai package root** (`packages/ilib-ai` in this monorepo):

- **`pnpm test`** — runs **unit tests only** (`tests/`, `jest.config.js`).
- **`pnpm test:integration`** — runs **integration tests only** (`test-integration/`, `jest.integration.config.cjs`).

Box integration credentials and layout are documented in **[test-integration/README.md](./test-integration/README.md)**. **Never commit** real secrets.

---

## Status

Unit tests live under **`tests/`** and run with **`pnpm test`** from the package root (not `test-integration/`). **`complete()`** and real **`listAvailableModels()`** behavior are still stubs to be filled in next. Treat unreleased API as subject to change until a stable version is published.

---

## License

Copyright © 2026, JEDLSoft

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE).

## Release notes

See [CHANGELOG.md](./CHANGELOG.md).

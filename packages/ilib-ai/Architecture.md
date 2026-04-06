# ilib-ai — technical architecture

This document describes how **ilib-ai** is structured and what callers can rely on.

**Distribution:** This file lives in the GitHub repository only. It is **not** included in the npm package (see `package.json` `files`). Contributors and advanced users read it on [GitHub](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-ai/Architecture.md).

---
## Goals and non-goals

### Goals

- **Transport only**: connect to an AI provider, send prompts and parameters the adapter maps to HTTP/SDK calls, and return **results** to the caller (including **error details** when a call fails at the HTTP/SDK layer).
- **Provider abstraction**: an **interface-like** base type (`AIModelAdapter`) that hides vendor-specific details.
- **Built-in providers (phase 1)**: **OpenAI** (ChatGPT / OpenAI HTTP APIs) and **Box AI**, as **subclasses** in this repo. **Box AI** uses the official **[Box Node SDK](https://github.com/box/box-node-sdk)** ([Box SDKs & tools](https://developer.box.com/sdks-and-tools)) for authentication and API access to Box Platform (including AI endpoints).
- **Session lifecycle**: after construction, callers **`connect()`** once to validate credentials and create reusable clients; **`complete()`** and (where applicable) **`listAvailableModels()`** run on that session; **`disconnect()`** tears down. See **`AIModelAdapter`** below.
- **Async-first**: network operations return **Promises**.
- **Factory entry point**: callers obtain adapters via **`createAIModelAdapter`** (see below). The factory lists **adapter** implementations (e.g. `"openai"`, `"box-ai"`), not individual LLM product names.
- **LLM model id in `complete()`**: which **model** to run (e.g. `gpt-4o-2024-08-06`, `azure__openai__gpt_4o_mini`) is a parameter on **`CompletionRequest`**. A single **Box AI adapter** can talk to **many** Box-exposed models; availability depends on Box’s catalog and the **tenant subscription**, not on the adapter class name.
- **Discoverable capabilities**: `getCapabilities()` describes static flags (model listing, defaults, etc.). **Batch** and **image/multimodal** inputs are **out of scope** for this initial version; use text-only `CompletionRequest` and repeated `complete()` for bulk work.

### Non-goals

- **No** embedded translation, lint, or review prompt templates. Callers craft prompts and interpret `rawContent`.
- **No** schema validation of model output; callers parse **`rawContent`** as they see fit. Box AI is often **best-effort** text.
- **Plugins / dynamic loading** are **out of scope** for phase 1; new providers mean **new subclasses** (and later, optional registry). The factory lists only **known built-in adapter** names until a registry exists.

---

## Factory: creating an adapter

### `createAIModelAdapter(name, initOptions)`

- **Parameters**
  - **`name`**: string id of a **built-in adapter** (e.g. `"openai"`, `"box-ai"` — exact literals documented as constants). This identifies **which provider integration** to use, **not** which LLM model to call.
  - **`initOptions`**: **provider-specific** initialization object (second argument name in code is often shortened to `init` in examples). Each built-in subclass has a dedicated TypeScript type (e.g. `OpenAIModelInitOptions`, `BoxAIModelInitOptions`) documented **on that subclass and/or on the type** in TSDoc. This object only carries **configuration** (keys, paths, base URLs, Box `contextFileId`, etc.); it does **not** establish a live session by itself.
- **Returns**: an instance of **`AIModelAdapter`** (concrete subclass). The instance is **not** connected to the provider until **`connect()`** succeeds.
- **Throws**
  - If **`name`** is not one of the **known** built-in adapter ids.
  - If **construction-time validation** fails (missing/invalid credentials such that the adapter cannot even be configured). Callers should not rely on partially constructed objects.

### `listKnownAIModelAdapterNames()`

- **Returns** a read-only list of **string ids** for every **adapter implementation** compiled into this library (e.g. `["openai", "box-ai"]`).
- Used to choose **which integration** to construct (OpenAI vs Box, etc.). It does **not** enumerate LLM model names available at runtime on the provider.

---

## Listing which LLM models an adapter can use

**Terminology**

- **Adapter name** (factory): which **integration** (`openai`, `box-ai`, …).
- **Model name** (`CompletionRequest.model`): which **LLM** to invoke for that request. For Box, the set of valid ids is defined by **Box** and the **customer’s** entitlements.

**Design**

- **`getCapabilities()`** stays **synchronous** and returns **static** facts: e.g. a **default** model id hint, `maxConcurrentRequests`, and **`supportsModelListing`**.
- **Enumerating models** is **asynchronous** and belongs on **`listAvailableModels(): Promise<ModelInfo[]>`**. For the built-in adapters that support listing (**OpenAI**, **Box**), callers must **`connect()`** first; implementations reject if not connected.

Do **not** fold that catalog into `getCapabilities()` as a synchronous value—subscriptions and provider-side catalogs change over time and require I/O.

Implementations may return an **empty** array on failure or when unsupported; `supportsModelListing` lets UIs disable “refresh models” when pointless.

---

## Core types (provider-agnostic)

Types are TypeScript **interfaces** / enums.

### `CompletionRequest`

| Field | Purpose |
| --- | --- |
| `systemPrompt` | Instructions / role. |
| `userContent` | Caller-defined payload (often JSON string). **Not interpreted** by the library. |
| `model` | **LLM** model id for this call (OpenAI model name, Box model API name for text gen, etc.). |
| `parameters` | Optional: `temperature`, `maxTokens`, `timeout`, etc. |

This version is **text-only**; there are no image or other multimodal attachments on `CompletionRequest`.

### `CompletionResponse`

| Field | Purpose |
| --- | --- |
| `rawContent` | Model output string on **success**. May be empty if the provider returns no text in edge cases. |
| `providerRequestId` | Optional (logging). |
| `error` | **Present when the adapter surfaces a failure** (HTTP error, SDK error, or provider error body). Omit or leave undefined on success. Should carry at least enough detail to log and debug; suggested fields below. |

**Suggested shape for `error` (illustrative; exact fields in TypeScript types):**

| Field | Purpose |
| --- | --- |
| `message` | Human-readable summary (required when `error` is set). |
| `httpStatus` | HTTP status code when the failure came from an HTTP response (optional). |
| `httpStatusText` | Status line text when available (optional). |
| `providerBody` | Raw response body snippet or parsed provider error payload for diagnostics (optional; avoid logging secrets). |

Whether **successful** HTTP responses with **application-level** errors inside `rawContent` are also copied into `error` is an implementation choice; at minimum, transport-level failures set `error`.

### `AdapterCapabilities`

Default model **hint**, `maxConcurrentRequests`, and **`supportsModelListing`**. No batch-queue API and no image inputs in v1: use multiple text `complete()` calls.

---

## Abstract base: `AIModelAdapter`

Construction stores **configuration** only. A **session** starts with **`connect()`** and ends with **`disconnect()`** (or adapter destruction).

| Method | Sync / async | Purpose |
| --- | --- | --- |
| `getProviderId()` | Sync | Stable adapter id (matches factory names where applicable). |
| `getDisplayName()` | Sync | Human-readable label. |
| `getCapabilities()` | Sync | `AdapterCapabilities` (static flags). |
| `isConfigured()` | Sync | Whether required configuration is present (may be true before `connect()`). |
| `connect()` | Async | Validates credentials with the provider (e.g. OpenAI handshake request, Box `users.getUserMe()`), prepares SDK clients. **Idempotent** if already connected. |
| `isConnected()` | Sync | Whether `connect()` completed successfully since the last `disconnect()`. |
| `disconnect()` | Async | Clears session / cached clients; after this, `connect()` again before `complete()`. |
| `complete(request)` | Async | **`request.model`** selects the LLM. Returns `Promise<CompletionResponse>`. Requires a prior successful **`connect()`** for built-in adapters that use network sessions. |
| `listAvailableModels()` | Async | Returns models this adapter/account can use. For built-in **OpenAI** and **Box** adapters, requires **`connect()`** first. |

---

## Built-in subclasses (phase 1)

Each subclass **documents its own initialization parameters** in **TSDoc** (and exported **`XxxModelInitOptions`** interfaces). The following is a summary only.

### `OpenAIModelAdapter`

- **Auth**: API key → `Authorization: Bearer` to OpenAI-compatible endpoints.
- **Init** (illustrative): `apiKey`, optional `baseUrl`, optional default model **hint**, timeouts as in `OpenAIModelInitOptions`.
- **Session**: **`connect()`** performs a lightweight API request to validate the key; **`complete()`** uses Chat Completions (or equivalent) on the same session.
- **Capabilities**: **`supportsModelListing: true`** (lists models via OpenAI’s models API when connected).

### `BoxAIModelAdapter`

- Uses the **[Box Node SDK](https://github.com/box/box-node-sdk)** for Box Platform authentication and requests. See [Box SDKs & tools](https://developer.box.com/sdks-and-tools).
- **Init**: access token and/or JWT config (`configPath`, `boxDeveloperJwtConfig`, or explicit fields) as in **`BoxAIModelInitOptions`**. **`contextFileId`** is required for **`complete()`** (Box `createAiTextGen` expects file context). Token refresh remains the **caller’s** or **app’s** responsibility unless we add helpers later.
- **Session**: **`connect()`** calls **`users.getUserMe()`** to validate the token.
- **Completions**: maps to **`createAiTextGen`** with **`ai_agent_text_gen`** / **`basic_gen.model`** from **`CompletionRequest.model`**.
- **Capabilities**: **`supportsModelListing: true`** (uses **`aiStudio.getAiAgents()`** when connected). **Multiple LLM models** are selected via **`complete({ model: ... })`**, not via separate adapter classes.

---

## Errors and configuration

- Invalid factory **`name`** or invalid **constructor** options → **throw** at **`createAIModelAdapter`** time when validation fails.
- **`isConfigured()`** false → **`connect()`** / **`complete()`** should fail clearly (rejected promise or `CompletionResponse` with `error`—see unit tests for each adapter).
- **`connect()`** failures → **rejected promise** (cannot establish session).
- **`complete()`** transport failures → typically **`CompletionResponse`** with **`error`** set (OpenAI); Box SDK errors may **reject** from **`complete()`** per tests.

---

## Testing strategy

### Unit tests (default CI)

- **Unit tests** use mocked HTTP/SDK and **require no real credentials**. They are the **normal** test target for this package (`pnpm test` from the package root).

### Integration tests (optional, off the critical path)

- **Integration tests** that call the **real Box API** live under **`test-integration/`** and run via **`pnpm test:integration`**. They are **not** part of the default unit suite.
- **Do not** block default CI on them; they **skip** when credentials are missing or invalid.
- Credential layout (two files: Box JWT download + **`box-integration-credentials.json`**, etc.) is documented in **`test-integration/README.md`**. **Never** commit real secrets; see **`.gitignore`**.

### Documenting the integration workflow for users

- **`README.md`** (package) points to **`test-integration/README.md`** for Box integration testing. Exact field names stay aligned with **`BoxAIModelInitOptions`** and the loader in **`loadIntegrationCredentials.ts`**.

---

## Documentation output (published API)

- **TypeDoc**: run the package’s `doc` script after install to generate HTML (and optional Markdown) under `docs/` from TypeScript sources.
- The **npm package** includes compiled **`lib`** and **`README.md`**; deep design stays in **this** file on GitHub.

---

## Future extensions

- Plugin or registry for third-party adapters.
- Additional providers (Claude, Azure OpenAI-compatible, etc.).
- Shared Box OAuth refresh helpers if multiple products need them.

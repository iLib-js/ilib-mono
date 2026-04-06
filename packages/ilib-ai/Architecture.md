# ilib-ai — technical architecture

This document describes how **ilib-ai** is structured and what callers can rely on once the library is implemented (including under TDD).

**Distribution:** This file lives in the GitHub repository only. It is **not** included in the npm package (see `package.json` `files`). Contributors and advanced users read it on [GitHub](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-ai/Architecture.md).

---

## Intended development order

Work is meant to proceed in this order:

1. **Review and agree on documentation** (this file and `README.md`).
2. **Scaffold the package** (TypeScript layout consistent with other new ilib packages, e.g. [ilib-po](../ilib-po)).
3. **Write unit tests** (TDD) against the agreed public API.
4. **Implement** adapters, factory, and HTTP/SDK wiring until tests pass.

Skipping ahead to implementation before the documents and tests are settled is intentionally out of sequence.

---

## Language and tooling

- **New ilib packages** are written in **TypeScript**, following the same general pattern as **ilib-po** (`tsconfig`, `tsc` build to `lib/`, **TypeDoc** for API reference).
- Published typings ship as **`lib/**/*.d.ts`** alongside compiled JS.
- Public surface: **interfaces**, **abstract base class**, concrete **subclasses** for each built-in provider, plus a small **factory** module.

---

## Goals and non-goals

### Goals

- **Transport only**: connect to an AI provider, send prompts and parameters the adapter maps to HTTP/SDK calls, and return **results** to the caller (including **error details** when a call fails at the HTTP/SDK layer).
- **Provider abstraction**: an **interface-like** base type (`AIModelAdapter`) that hides vendor-specific details.
- **Built-in providers (phase 1)**: **OpenAI** (ChatGPT / OpenAI HTTP APIs) and **Box AI**, as **subclasses** in this repo. **Box AI** uses the official **[Box Node SDK](https://github.com/box/box-node-sdk)** ([Box SDKs & tools](https://developer.box.com/sdks-and-tools)) for authentication and API access to Box Platform (including AI endpoints as implemented).
- **Async-first**: network operations return **Promises**.
- **Factory entry point**: callers obtain adapters via **`createAIModelAdapter`** (see below). The factory lists **adapter** implementations (e.g. `"openai"`, `"box-ai"`), not individual LLM product names.
- **LLM model id in `complete()`**: which **model** to run (e.g. `gpt-4o-2024-08-06`, `azure__openai__gpt_4o_mini`) is a parameter on **`CompletionRequest`** (or equivalent). A single **Box AI adapter** can talk to **many** Box-exposed models; availability depends on Box’s catalog and the **tenant subscription**, not on the adapter class name.
- **Discoverable capabilities**: `getCapabilities()` describes static flags (structured output, model listing, etc.). **Batch** and **image/multimodal** inputs are **out of scope** for this initial version; use text-only `CompletionRequest` and repeated `complete()` for bulk work.

### Non-goals

- **No** embedded translation, lint, or review prompt templates. Callers craft prompts and interpret `rawContent`.
- **No** guarantee of JSON on the wire unless the provider and adapter support strict structured output; Box AI is often **best-effort** text.
- **Plugins / dynamic loading** are **out of scope** for phase 1; new providers mean **new subclasses** (and later, optional registry). The factory lists only **known built-in adapter** names until a registry exists.

---

## Factory: creating an adapter

### `createAIModelAdapter(name, init)`

- **Parameters**
  - **`name`**: string id of a **built-in adapter** (e.g. `"openai"`, `"box-ai"` — exact literals documented as constants). This identifies **which provider integration** to use, **not** which LLM model to call.
  - **`init`**: **provider-specific** initialization object. Each built-in subclass has a dedicated TypeScript type (e.g. `OpenAIModelInitOptions`, `BoxAIModelInitOptions`) documented **on that subclass and/or on the type** in TSDoc.
- **Returns**: an instance of **`AIModelAdapter`** (concrete subclass).
- **Throws**
  - If **`name`** is not one of the **known** built-in adapter ids.
  - If **initialization fails** (missing/invalid credentials, invalid combination of options, etc.). Callers should not rely on partially constructed objects.

### `listKnownAIModelAdapterNames()`

- **Returns** a read-only list of **string ids** for every **adapter implementation** compiled into this library (e.g. `["openai", "box-ai"]`).
- Used to choose **which integration** to construct (OpenAI vs Box, etc.). It does **not** enumerate LLM model names available at runtime on the provider.

---

## Listing which LLM models an adapter can use

**Terminology**

- **Adapter name** (factory): which **integration** (`openai`, `box-ai`, …).
- **Model name** (`CompletionRequest.model`): which **LLM** to invoke for that request. For Box, the set of valid ids is defined by **Box** and the **customer’s** entitlements.

**Design recommendation**

- **`getCapabilities()`** should stay **synchronous** and return **static** facts: e.g. `supportsStructuredOutput`, hints like a **default** model id, `maxConcurrentRequests`, and **`supportsModelListing`** (whether the adapter can report a live catalog).
- **Enumerating models available to this account** is **asynchronous** (may require network calls to OpenAI’s model list API, Box’s configuration, etc.) and may **fail** independently of `complete()`. Therefore it belongs on a dedicated **async** method on **`AIModelAdapter`**, for example:
  - **`listAvailableModels(): Promise<ModelInfo[]>`**

Do **not** fold that catalog into `getCapabilities()` as a synchronous value—subscriptions and provider-side catalogs change over time and require I/O.

Implementations may return an **empty** array if listing is not supported or not yet implemented; `supportsModelListing` (or equivalent) lets UIs disable “refresh models” when pointless.

---

## Core types (provider-agnostic)

Types are TypeScript **interfaces** / enums.

### `CompletionRequest`

| Field | Purpose |
| --- | --- |
| `systemPrompt` | Instructions / role. |
| `userContent` | Caller-defined payload (often JSON string). **Not interpreted** by the library. |
| `model` | **LLM** model id for this call (OpenAI model name, Box `ai_agent` / model string, etc.). |
| `parameters` | Optional: `temperature`, `maxTokens`, `timeout`, etc. |

This version is **text-only**; there are no image or other multimodal attachments on `CompletionRequest`.

### `CompletionResponse`

| Field | Purpose |
| --- | --- |
| `rawContent` | Model output string on **success**. May be empty if the provider returns no text in edge cases. |
| `providerRequestId` | Optional (logging). |
| `isStructuredOutput` | Whether the response path **guaranteed** schema-bound output vs best-effort text. |
| `error` | **Present when the adapter surfaces a failure** (HTTP error, SDK error, or provider error body). Omit or leave undefined on success. Should carry at least enough detail to log and debug; suggested fields below. |

**Suggested shape for `error` (illustrative; exact fields in TypeScript types):**

| Field | Purpose |
| --- | --- |
| `message` | Human-readable summary (required when `error` is set). |
| `httpStatus` | HTTP status code when the failure came from an HTTP response (optional). |
| `httpStatusText` | Status line text when available (optional). |
| `providerBody` | Raw response body snippet or parsed provider error payload for diagnostics (optional; avoid logging secrets). |

Whether **successful** HTTP responses with **application-level** errors inside `rawContent` (e.g. JSON `{ "error": "..." }` from the model) are also copied into `error` is an implementation choice; at minimum, transport-level failures set `error`.

### `AdapterCapabilities`

Flags such as `supportsStructuredOutput`, default model **hint**, `maxConcurrentRequests`, and **`supportsModelListing`**. No batch-queue API and no image inputs in v1: use multiple text `complete()` calls.

---

## Abstract base: `AIModelAdapter`

| Method | Purpose |
| --- | --- |
| `getProviderId()` | Stable adapter id (matches factory names where applicable). |
| `getDisplayName()` | Human-readable label. |
| `getCapabilities()` | `AdapterCapabilities` (synchronous, static flags). |
| `isConfigured()` | Whether required configuration is present. |
| `complete(request)` | `Promise<CompletionResponse>`; **`request.model`** selects the LLM. |
| `listAvailableModels()` | **Async**; returns models this adapter/account can use (see above). |

---

## Built-in subclasses (phase 1)

Each subclass **documents its own initialization parameters** in **TSDoc** (and exported **`XxxModelInitOptions`** interfaces). The following is a summary only.

### `OpenAIModelAdapter`

- **Auth**: API key → `Authorization: Bearer` to OpenAI-compatible endpoints.
- **Init** (illustrative): `apiKey`, optional `baseUrl`, optional default model **hint**, timeouts as agreed in `OpenAIModelInitOptions`.
- **Implementation detail**: may use Chat Completions and/or Responses API internally; callers only see `CompletionRequest` / `CompletionResponse`.

### `BoxAIModelAdapter`

- Uses the **[Box Node SDK](https://github.com/box/box-node-sdk)** for Box Platform authentication and requests. See [Box SDKs & tools](https://developer.box.com/sdks-and-tools).
- **Init** (illustrative): access token and/or JWT-related fields as required by Box (see **`BoxAIModelInitOptions`** TSDoc). Token refresh remains the **caller’s** or **app’s** responsibility unless we add helpers later.
- **Capabilities**: structured output not native—**best-effort** parsing of `rawContent`. **Multiple LLM models** are selected via **`complete({ model: ... })`**, not via separate adapter classes.

---

## Errors and configuration

- Invalid factory **`name`** or failed **`init`** → **throw** at factory time when possible.
- **`isConfigured()`** false → **`complete`** must fail clearly when invoked (e.g. rejected promise or `CompletionResponse` with `error` set—exact policy TBD in implementation).
- Transport and SDK failures → populate **`CompletionResponse.error`** (and/or reject—team should pick one consistent pattern in tests).

---

## Testing strategy (TDD)

### Unit tests (default CI)

- **Unit tests** use mocked HTTP/SDK and **require no real credentials**. They are the **normal** test target for this package and belong on the **critical path** for CI (e.g. `pnpm test` / affected `turbo test`), consistent with other ilib-mono packages.

### Integration / E2E tests (optional, off the critical path)

- **Integration tests** that call **real** OpenAI and/or Box AI are **optional**. They are **not** run as part of the standard monorepo **e2e** pipeline for this package, because CI and most contributors **do not** have the credentials or context to run them.
- **Do not** block merges or default CI on these tests. Wire them as a **separate** script (e.g. `test:integration` or similar) that is **not** included in the default `turbo test` / `turbo test:e2e` graph for `ilib-ai`, or guard them so they **no-op / skip** unless explicitly enabled.

### Credential config JSON (caller-supplied)

- The **caller** (developer running integration tests locally or in a private environment) is responsible for obtaining tokens and secrets from **whatever private store or process** they use. This library’s documentation does **not** prescribe how credentials are stored or rotated outside of tests, and does not expose org-specific practices.
- For integration tests, credentials are supplied via a **JSON file** whose path is passed in by the runner (e.g. an environment variable such as `ILIB_AI_INTEGRATION_CONFIG` pointing at a file path). The JSON shape should mirror the **initialization options** needed by each adapter under test (e.g. fields compatible with `OpenAIModelInitOptions`, `BoxAIModelInitOptions`), so the test harness can pass them into `createAIModelAdapter` without embedding secrets in source control.
- **Never** commit real credential files. Add the filename pattern to `.gitignore` (e.g. `*-integration-config.json`, or a single documented name like `ilib-ai.integration.json` in the user’s home or outside the repo).

### Documenting the integration workflow for users

- **README.md** should describe: that integration tests exist, that they are optional, that they require a **JSON config file** created by the user, how to point the test runner at that file, and the **example minimal shape** of the JSON (placeholders only). Exact field names stay aligned with the TypeScript init types once implemented.

---

## Documentation output (published API)

- **TypeDoc** (same general approach as **ilib-po**): run the package’s `doc` script after install to generate HTML (and optional Markdown) under `docs/` from TypeScript sources.
- The **npm package** includes compiled **`lib`** and **`README.md`**; deep design stays in **this** file on GitHub.

---

## Future extensions

- Plugin or registry for third-party adapters.
- Additional providers (Claude, Azure OpenAI-compatible, etc.).
- Shared Box OAuth refresh helpers if multiple products need them.

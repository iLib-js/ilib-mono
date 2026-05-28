# ilib-ai — integration tests (Box & OpenAI)

These tests call **real provider APIs**. They are **not** part of the default unit test suite because they require credentials you configure locally — **never commit** those files.

Credential-mapping tests (static, no network) **always run**. **Box** and **OpenAI** live-API suites are **skipped** when that provider’s credentials are missing or invalid, so developers without secrets are not blocked.

---

## Prerequisites

1. **Node.js 18+** — required for OpenAI tests (`OpenAIModelAdapter` uses global `fetch`).
2. **Dependencies installed** — from the monorepo root or the package directory:

   ```bash
   cd packages/ilib-ai
   pnpm install
   ```

   (If you work from the repo root: `pnpm install --filter ilib-ai`.)

3. **Working directory** — all commands below assume you are in **`packages/ilib-ai`** (the ilib-ai package root).

---

## Step-by-step: OpenAI (ChatGPT / Chat Completions)

### 1. Get an API key

1. Sign in at [platform.openai.com](https://platform.openai.com).
2. Open **API keys** and create a key (this is **not** your chat.openai.com password).
3. Ensure your account has API access and billing/quota for the model you will test (default: **`gpt-4o-mini`**).

### 2. Create the local credentials file

From **`packages/ilib-ai`**:

```bash
cp test-integration/openai-integration-credentials.example.json \
   test-integration/openai-integration-credentials.json
```

### 3. Add your key

Edit **`test-integration/openai-integration-credentials.json`**. Minimal example:

```json
{
  "apiKey": "sk-your-key-here",
  "integrationTestModel": "gpt-4o-mini"
}
```

**Alternative:** leave **`apiKey`** empty and export the key when you run tests:

```bash
export OPENAI_API_KEY=sk-your-key-here
```

The file wins over the environment variable when both are set.

### 4. Run OpenAI integration tests

```bash
pnpm test:integration --testPathPattern=openai
```

Expected: **`openaiCredentialsMapping`** passes; **`openai-adapter-connection`** and **`openai-prompts`** run against the live API (not skipped).

### 5. What those tests do

| Test file | What it checks |
|-----------|----------------|
| `openaiCredentialsMapping.test.ts` | Credential loader (no API call). Always runs. |
| `openai-adapter-connection.integration.test.ts` | `connect()` / `disconnect()`, `listAvailableModels()`. |
| `openai-prompts.integration.test.ts` | `OpenAIModelAdapter.complete()` — minimal deterministic JSON ping (see **`fixtures/minimal-ping-expected.json`**) plus structured JSON prompts. |

---

## Step-by-step: Box AI

### 1. Download the JWT config from Box

1. Log in to **Box** in the browser.
2. Open the **Developer Console** (bottom left of the Box UI).
3. Go to **My Platform Apps** → select or create an app.
4. Open the **Configuration** tab.
5. Under **Manage Signature Keys**, click **Generate Keypair**.

Box downloads a JSON file named like **`<enterpriseID>_<publicKeyID>_config.json`**. **Do not edit** its internal shape.

### 2. Place the JWT file in `test-integration/`

Move the download into **`packages/ilib-ai/test-integration/`** (same folder as this README). Example filename: **`27335_abc123_config.json`**.

This file is **gitignored** — it must stay on your machine only.

### 3. Create the integration overlay file

From **`packages/ilib-ai`**:

```bash
cp test-integration/box-integration-credentials.example.json \
   test-integration/box-integration-credentials.json
```

Edit **`test-integration/box-integration-credentials.json`**. Point **`jwtConfigPath`** at your download (relative to **`test-integration/`**):

```json
{
  "jwtConfigPath": "27335_abc123_config.json",
  "contextFileId": "",
  "rootFolderId": ""
}
```

Replace **`27335_abc123_config.json`** with your real filename.

### 4. (Optional) Configure file context for Box AI prompt tests

Box **`createAiTextGen`** requires a **file** in the request. Connection-only tests do **not** need this step.

For **`box-ai-prompts.integration.test.ts`**, set **one** of:

| Field | When to use |
|-------|-------------|
| **`contextFileId`** | You know a Box **file id** the app can read. |
| **`rootFolderId`** | Leave **`contextFileId`** empty; tests use the **first file** in that folder. |

Example with a folder:

```json
{
  "jwtConfigPath": "27335_abc123_config.json",
  "contextFileId": "",
  "rootFolderId": "123456789012"
}
```

Upload at least one file to that folder if you use **`rootFolderId`**.

### 5. Run Box integration tests

**Connection only** (JWT + `connect()`):

```bash
pnpm test:integration --testPathPattern='integrationCredentialsMapping|box-adapter-connection'
```

**All Box tests** (includes live Box AI prompts if file context is configured):

```bash
pnpm test:integration --testPathPattern=box
```

### 6. What those tests do

| Test file | What it checks |
|-----------|----------------|
| `integrationCredentialsMapping.test.ts` | Credential mapping (no API call). Always runs. |
| `box-adapter-connection.integration.test.ts` | `BoxAIModelAdapter` `connect()` / `disconnect()`. |
| `box-ai-prompts.integration.test.ts` | `createAiTextGen` with JSON-shaped prompts. |

---

## Run commands (reference)

All commands from **`packages/ilib-ai`**:

| Command | What runs |
|---------|-----------|
| **`pnpm test`** | **Unit tests only** — does **not** run integration tests. |
| **`pnpm test:unit`** | Same as **`pnpm test`**. |
| **`pnpm test:integration`** | **All** integration tests (OpenAI + Box + static mapping tests). |
| **`pnpm test:integration --testPathPattern=openai`** | OpenAI suites only. |
| **`pnpm test:integration --testPathPattern=box`** | Box suites (+ Box credential mapping). |

Default per-test timeout is **120 seconds**. Tests run **serially** (`--runInBand`).

---

## Credentials reference

### OpenAI — `openai-integration-credentials.json`

Copy from **`openai-integration-credentials.example.json`**. Gitignored when real.

| Field | Purpose |
|-------|---------|
| **`apiKey`** | OpenAI API key. Or empty + **`OPENAI_API_KEY`** env var. |
| **`baseUrl`** | Optional. Default `https://api.openai.com`. |
| **`defaultModel`** | Optional; passed through to **`OpenAIModelInitOptions`**. |
| **`integrationTestModel`** | Model for prompt tests. Default **`gpt-4o-mini`**. |

### Box — `box-integration-credentials.json`

Copy from **`box-integration-credentials.example.json`**. Gitignored when real.

| Field | Purpose |
|-------|---------|
| **`jwtConfigPath`** | Relative path to the Box JWT download in **`test-integration/`**. Same as **`configPath`**; if both are set, **`configPath`** wins. |
| **`configPath`** | Alternative name for the JWT file path. |
| **`userId`** | **Usually omit.** Only for app-user JWT when **`userID`** is not in the Box export. |
| **`contextFileId`** | Box file id for AI prompt tests. |
| **`rootFolderId`** | Folder id; first child file is used when **`contextFileId`** is empty. |

**Single-file alternative:** embed **`boxAppSettings`** + **`enterpriseID`** directly in **`box-integration-credentials.json`** instead of a separate JWT download. See **`box-jwt-download.example.json`** for the JWT file shape.

### Which Box suites need file context?

| Suite | Needs `contextFileId` or `rootFolderId`? |
|-------|------------------------------------------|
| **`box-adapter-connection`** | **No** |
| **`box-ai-prompts`** | **Yes** |

---

## Troubleshooting

### OpenAI

- **401 / invalid API key** — Verify the key at platform.openai.com; ensure billing is active.
- **429 rate limit** — Retry later or set a smaller model in **`integrationTestModel`**.
- **`fetch is not defined`** — Use Node.js **18+**.
- **OpenAI suites skipped** — No valid key in the credentials file or **`OPENAI_API_KEY`**.
- **Timeouts** — Re-run; default timeout is 120s per test.

### Box

- **401 / JWT** — Verify app credentials; private key must match the public key in the Developer Console.
- **403 `insufficient_scope`** — Your token lacks Box AI privileges. Adjust app scopes / enterprise Box AI settings, or ask your Box admin.
- **“Add contextFileId or rootFolderId”** — Required for **`box-ai-prompts`**; add one to **`box-integration-credentials.json`**.
- **Missing JWT file** — **`jwtConfigPath`** must point to a file that exists under **`test-integration/`** (or use an absolute path).
- **Box suites skipped** — Missing or invalid **`box-integration-credentials.json`** or JWT file.
- **Timeouts** — Re-run; default timeout is 120s per test.

---

## Security

Never commit:

- **`openai-integration-credentials.json`** (with a real key)
- **`box-integration-credentials.json`** (with real paths/settings)
- **`*_config.json`** (Box JWT downloads)
- **`*.pvk`**, **`*.pem`**

Patterns are listed in **`packages/ilib-ai/.gitignore`**.

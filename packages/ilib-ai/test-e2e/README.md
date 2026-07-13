# ilib-ai — E2E tests (CLI sample)

End-to-end tests spawn a **fresh `samples/cli` process for each test**: wait for the input prompt, send one AI prompt on stdin, assert on stdout, send `.exit`, and wait for the process to exit (or kill it on timeout).

**Not** run by default **`pnpm test`**. Use **`pnpm test:e2e`** from **`packages/ilib-ai`**.

## Prerequisites

1. **Node.js 18+**
2. **ilib-ai built:** `pnpm build`
3. **CLI sample deps:** `pnpm install` in `samples/cli` (or `pnpm install --filter ilib-ai-cli-sample` from repo root)
4. **OpenAI credentials** for e2e only (not the integration-test credentials path):

   | Source | Location / usage |
   |--------|------------------|
   | **Local file** | `test-e2e/__testfiles__/cli/credentials.json` with a non-empty **`apiKey`** |
   | **Environment** | **`OPENAI_API_KEY`** — if the file is missing or has an empty **`apiKey`**, the e2e harness writes **`credentials.json`** in that directory before running the CLI |

   Copy **`__testfiles__/cli/credentials.example.json`** to **`credentials.json`** and add your key, or export **`OPENAI_API_KEY`** when you run the tests.

   The CLI is always started from **`test-e2e/__testfiles__/cli/`** with **`--credentials credentials.json`**.

## Run

```bash
cd packages/ilib-ai
cp test-e2e/__testfiles__/cli/credentials.example.json \
   test-e2e/__testfiles__/cli/credentials.json
# edit apiKey, or: export OPENAI_API_KEY=sk-…
pnpm build
pnpm test:e2e
```

Watch mode: **`pnpm test:e2e:watch`**

If neither a usable local file nor **`OPENAI_API_KEY`** is available, the suite is **skipped**.

## What runs

| Test | Prompt style | Assertion |
|------|----------------|-----------|
| Minimal ping | Fixed JSON `format` + `message` | Matches `test-integration/fixtures/minimal-ping-expected.json` |
| JSON echo | `ilib-ai-test-v1` / `ok` / `7` | Same shape as integration `openai-prompts` |
| Geo JSON | Capital of France | `capital` is `Paris` |

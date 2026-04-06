# ilib-ai — integration tests (Box)

These tests call the **real Box API**. They are **not** part of the default unit test suite because they
require actual account information that you have to download/configure before you can run these tests,
which of course should never be committed to git.

## What Files are Needed

1. The Box JWT Config File downloaded from your Box developer console
2. The integration-only settings

## How to Get the JWT Config File

1. Log in to your **Box** account in the browser.
2. Open the **Developer Console** (link in the **bottom left** of the Box UI).
3. Go to the **My Platform Apps** tab.
4. Click **New App +** (top right) to create a new Box application (or select an existing app).
5. Open your app and go to the **Configuration** tab.
6. Under **Manage Signature Keys**, click **Generate Keypair**. Box downloads a JSON file whose name matches **`<enterpriseID>_<publicKeyID>_config.json`** (labels can vary slightly by Box console version).

That download is the **`boxAppSettings`** JWT file this document refers to. **Never commit** it; see `.gitignore` (patterns under `test-integration/` ignore typical download names).

## Integration-only Settings

Keep the **Box JWT export** separate from **integration-only** settings. Both live under **`packages/ilib-ai/test-integration/`**.

| File | Role |
|------|------|
| **`<enterpriseID>_<publicKeyID>_config.json`** | The file Box downloads when you generate a keypair (see above). The filename uses your real enterprise id and public key id—for illustration only, a fake example would be **`9999999_xxxxxxx_config.json`**. Do not edit its internal shape. |
| **`box-integration-credentials.json`** | Local overlay: a **path** to that JWT file, optional **`userId`** (only in the case described below), and **`contextFileId`** / **`rootFolderId`** for tests that call Box AI text generation. |

### Shape of the `box-integration-credentials.json` File

Minimal shape (JWT path + test context only):

```json
{
  "jwtConfigPath": "9999999_xxxxxxx_config.json",
  "contextFileId": "",
  "rootFolderId": ""
}
```

Use placeholder names like **`9999999_xxxxxxx_config.json`** only in docs; your real file will use your actual **enterprise id** and **public key id**.

| Field | Purpose |
|-------|---------|
| **`jwtConfigPath`** | Relative path (from **`test-integration/`**) to the downloaded **`<enterpriseID>_<publicKeyID>_config.json`** file. Same meaning as **`configPath`** in **`BoxAIModelInitOptions`**; use whichever name you prefer. If both are present, **`configPath`** wins. |
| **`configPath`** | Alternative to **`jwtConfigPath`** (Box SDK / `box-node-sdk` name). |
| **`userId`** | **Usually omit this.** The JWT file already contains **`enterpriseID`** (and Box may include a top-level **`userID`** in some exports). Our loader passes those into the Box SDK. Add **`userId`** in this overlay **only** if you authenticate **as an app user** and you need to supply the app user’s id here because it is **not** present in the downloaded JSON as **`userID`**. Enterprise-only JWT using the file’s **`enterpriseID`** does not need **`userId`** in the overlay. |
| **`contextFileId`** | Box **file** id for **`createAiTextGen`** `items`. Prefer this when you know the file id. |
| **`rootFolderId`** | If **`contextFileId`** is empty, the tests list this folder and use the **first** direct child with **`type === "file"`**. |

### Shape of the Box JWT file (`<enterpriseID>_<publicKeyID>_config.json`)

Always the same structure Box exports, for example (values are illustrative placeholders only):

```json
{
  "boxAppSettings": {
    "clientID": "…",
    "clientSecret": "…",
    "appAuth": {
      "publicKeyID": "xxxxxxx",
      "privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\n…\n-----END ENCRYPTED PRIVATE KEY-----\n",
      "passphrase": "…"
    }
  },
  "enterpriseID": "9999999"
}
```

See **`box-jwt-download.example.json`** in this folder for a full placeholder example (that filename is committed; real downloads use the `*_config.json` pattern and should stay local / gitignored).

### `contextFileId` and `rootFolderId`

These are **not** from Box; they are only for this repo’s tests.

| Suite | Needs file context? |
|-------|---------------------|
| **`box-adapter-connection`** | **No.** JWT + **`connect()`** is enough. |
| **`box-ai-prompts`** | **Yes.** Box **`createAiTextGen`** requires a **`file`** in **`items`**. Set **`contextFileId`** and/or **`rootFolderId`** as above. |

## Single-file Alternative

You may instead put **`boxAppSettings`** (and **`enterpriseID`** / **`userID`**) **inside** **`box-integration-credentials.json`** without a separate Box download file; **`loadBoxInit`** still supports that. The two-file layout is recommended so the console export stays untouched.

## Run (from the **ilib-ai package root**, i.e. `packages/ilib-ai`)

| Command | What runs |
|---------|-----------|
| **`pnpm test`** | **Unit tests only** (`tests/`, `jest.config.js`). Does **not** run integration tests. |
| **`pnpm test:unit`** | Same as **`pnpm test`**. |
| **`pnpm test:integration`** | **Integration tests only** (`test-integration/`, `jest.integration.config.cjs`). Does **not** run unit tests. |

## What Runs

| Test file | What it checks |
|-----------|----------------|
| `integrationCredentialsMapping.test.ts` | **Static:** `stripIntegrationOnlyFields` / `normalizeIntegrationCredentialPaths` (no Box API). Always runs. |
| `box-adapter-connection.integration.test.ts` | **`BoxAIModelAdapter`**: `connect()` / `disconnect()` via `users.getUserMe`. |
| `box-ai-prompts.integration.test.ts` | **`createBoxClientFromInit`** + **`createAiTextGen`** with JSON-shaped prompts. |

If **`box-integration-credentials.json`** is missing or invalid, the **Box API** suites are **skipped** (they do not fail the job for developers without secrets). The credential-mapping tests do not require credentials.

## Troubleshooting

- **401 / JWT**: Verify app credentials and that the private key matches the public key in the Box Developer Console.
- **403 `insufficient_scope`**: If you see something like:  
  `BoxApiError: 403 "insufficient_scope" "The request requires higher privileges than provided by the access token."; Request ID: "…"`  
  then you do not have permission in Box to run **Box AI** in that account for the token in use (often when **`box-ai-prompts`** runs). Adjust **application scopes** and enterprise **Box AI** settings in the Developer Console if you can; otherwise talk to your **Box administrator** to get access to Box AI so your app or user receives the required privileges.
- **“Add contextFileId or rootFolderId”**: Add one or both optional fields to `box-integration-credentials.json`.
- **Missing JWT file**: Ensure **`jwtConfigPath`** / **`configPath`** points to a file that exists next to **`box-integration-credentials.json`** (or use an absolute path).
- **Timeouts**: Default test timeout is 120s; slow networks may need a re-run.

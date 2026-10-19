# mojito-sdk — integration tests

These tests call a **real Mojito server**. They are **not** part of the default
unit test suite. Live suites are **skipped** when local credentials are missing,
so developers without a Mojito login are not blocked.

Credential-mapping tests (static, no network) **always run**.

---

## Prerequisites

1. **Node.js 18+**
2. Dependencies installed (`pnpm install` from the monorepo root)
3. A reachable Mojito instance and local CLI property files (or inline credentials)

Working directory for the commands below: **`packages/mojito-sdk`**.

---

## How Mojito CLI config layering works

The local `mojito` wrapper typically runs something like:

```sh
java -jar mojito-cli.jar \
  --spring.config.additional-location="file://${HOME}/.l10n/config/cli/" \
  --spring.profiles.active=cli,formlogincredentialprovider
```

Spring Boot then layers **specific filenames**, in order (later wins):

1. `~/.l10n/config/cli/application.properties`
2. `~/.l10n/config/cli/application-cli.properties`
3. `~/.l10n/config/cli/application-formlogincredentialprovider.properties`

It does **not** load every `application-*.properties` file in the directory.
`application-dev.properties` / `application-test.properties` are only used when
those profiles are active (for example the `mojito-dev` wrapper uses
`dev,formlogincredentialprovider`).

`mojito-sdk` follows the same model via `configFiles` or `configDir` + `profiles`.

---

## Set up credentials

### 1. Create the local credentials file

```bash
cp test-integration/mojito-integration-credentials.example.json \
   test-integration/mojito-integration-credentials.json
```

### 2. Choose a connection style

**Option A — reuse `~/.l10n/config/cli` with CLI profiles** (recommended here):

```json
{
  "loadCliConfig": true,
  "configDir": "~/.l10n/config/cli",
  "profiles": ["cli", "formlogincredentialprovider"],
  "repositoryName": "",
  "searchSource": "",
  "searchLimit": 5
}
```

**Option B — name the exact property files to layer**:

```json
{
  "loadCliConfig": true,
  "configFiles": [
    "~/.l10n/config/cli/application.properties",
    "~/.l10n/config/cli/application-cli.properties",
    "~/.l10n/config/cli/application-formlogincredentialprovider.properties"
  ]
}
```

Use the `dev` profile / files when you normally run `mojito-dev`.

**Option C — explicit STATEFUL login** (no CLI files):

```json
{
  "scheme": "https",
  "host": "mojito.example.com",
  "port": 443,
  "authenticationMode": "STATEFUL",
  "username": "alice",
  "password": "secret",
  "loadCliConfig": false
}
```

You may leave `username` / `password` empty and export them instead:

```bash
export MOJITO_USERNAME=alice
export MOJITO_PASSWORD=secret
```

The file wins when both are set.

**Option D — HEADER auth** (for example Cloudflare Access):

```json
{
  "scheme": "https",
  "host": "mojito.example.com",
  "port": 443,
  "authenticationMode": "HEADER",
  "headers": {
    "CF-Access-Client-Id": "…",
    "CF-Access-Client-Secret": "…"
  },
  "loadCliConfig": false
}
```

### 3. Run the tests

```bash
pnpm test:integration
```

Expected:

- `mojitoCredentialsMapping` passes (always)
- `connection.integration` runs against the live server when credentials are present

---

## What the live suite checks

| Test | Purpose |
|------|---------|
| lists repositories | Auth + `server.repositories` round-trip |
| searches source strings | Auth + `server.searchSourceStrings` against one repo |

Optional knobs in the credentials file:

| Field | Purpose |
|-------|---------|
| `repositoryName` | Prefer this repo (exact name filter). Empty → first listed repo. |
| `searchSource` | Optional `CONTAINS` filter on source text. Empty → unfiltered sample. |
| `searchLimit` | Max strings to request. Default `5`. |

---

## Commands

| Command | What runs |
|---------|-----------|
| `pnpm test` | Unit tests only — does **not** run integration tests |
| `pnpm test:integration` | Mapping tests + live suites (live suites skip without credentials) |

Default per-test timeout is **120 seconds**. Tests run **serially** (`maxWorkers: 1`).

---

## Security

Never commit `test-integration/mojito-integration-credentials.json` with real
secrets. It is listed in the repository root `.gitignore`.

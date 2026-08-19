# Mojito SDK object model

The SDK exposes a stable object model over an OpenAPI-derived HTTP client.

## Layers

1. **Auth** — loads Mojito CLI `l10n.resttemplate.*` settings and performs
   STATEFUL form-login (+ CSRF) or HEADER authentication.
2. **Low-level client** — marshals parameters for each OpenAPI `operationId`
   and unpacks JSON responses (`LowLevelClient.call`).
3. **Object model** — ergonomic resources used by applications.

## Resources

| Class | Mojito concept | Key methods |
|-------|----------------|-------------|
| `MojitoClient` | SDK entry point | `listRepositories`, `listDrops`, `searchTextUnits`, `listLocales`, `me`, `call` |
| `Repository` | Translation project | `list`, `find`, `get`, `create`, `update`, `delete` |
| `Drop` | Vendor translation batch | `list`, `export`, `import`, `cancel`, `complete` |
| `TextUnit` | Translatable string | `search` |
| `Locale` | BCP 47 locale | `list` |
| `PollableTask` | Async job | `get`, `refresh` |
| `User` | Account / session | `me`, `isSessionActive` |

Unknown optional parameters are forwarded to Mojito for forward compatibility.

## Versioning

`mojito-sdk` follows semver for its own package versions. That version is
unrelated to Mojito’s version; supported Mojito API surface is reported by:

- `getSdkVersion()` — SDK package semver
- `getOpenApiSpecVersion()` — OpenAPI `info.version` used at generation
- `getApiInfo()` — generation metadata (and live probes when a client is passed)

## Compatibility

After a public object or method is released:

- New methods and optional parameters may be added in minor releases.
- Deprecated APIs remain available until a major release.
- Removing or changing the meaning of an API requires a major release.
- Unknown optional request parameters are forwarded to Mojito for forward
  compatibility.

## Authentication

By default the client reads `~/.l10n/config/cli/application*.properties` (same
keys as the Mojito CLI). You can also pass explicit `MojitoClient` options
(`host`, `username`, `password`, `authenticationMode`, `headers`, …).

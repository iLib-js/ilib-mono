# Mojito SDK object model

The SDK exposes a stable object model over an OpenAPI-derived HTTP client.
How the layers fit together, and the design rules for this layer, are
described in [`Architecture.md`](Architecture.md).

The published package API is this object model (plus version helpers).
Transport, generated DTOs, and auth providers are not part of that surface.

## Layers

1. **Auth** — loads Mojito CLI `l10n.resttemplate.*` settings and performs
   STATEFUL form-login (+ CSRF) or HEADER authentication.
2. **Generated DTOs and low-level client** — DTOs represent OpenAPI wire
   formats; the client marshals each `operationId` and unpacks JSON responses.
3. **Object model** — ergonomic resources used by applications.

Generated DTOs are implementation details. Adding an OpenAPI operation or
schema does not automatically add anything to the public object model.

Every object-model class stores a `MojitoClient`. Static collection methods on
top-level types take that client as their first argument. Nested collections
are methods on the containing object.

## Resources

| Class | Mojito concept | Key methods |
|-------|----------------|-------------|
| `MojitoClient` | SDK session | `call` |
| `Repository` | Translation project | `list`, `find`, `get`, `create`, `update`, `delete`, `assets`, `branches`, `drops`, `exportDrop`, `screenshots`, `getLocales`, `setLocales`, `getSourceLocale`, `setSourceLocale` |
| `RepositoryType` | Reusable repository configuration | `list`, `get`, `create`, `update`, `delete` |
| `Drop` | Vendor translation batch | `list`, `export`, `import`, `cancel`, `complete` |
| `Asset` | Source file or virtual asset | `sourceStrings`, `localize`, `pseudoLocalize`, `importLocalized`, `delete` |
| `Branch` | Repository branch | `delete` |
| `SourceString` | Source-language string | `getTranslationHistory`, `translateWithAi` |
| `Translation` | Locale-specific translation | `reviewWithAi` |
| `Screenshot` | Visual context for strings | `list`, `update`, `delete` |
| `MojitoLocale` | Repository locale inheritance | locale, parent, inheritance state |
| `User` | Account / session | `me`, `isSessionActive` |

Mojito pollable tasks remain internal. Long-running methods return Promises,
poll until the server operation finishes, and support timeout/cancellation
options.

Plain locales are represented by `Locale` from `ilib-locale`. `MojitoLocale`
adds the three repository target-locale states: fully translated, inherited
from an explicit parent, or inherited from the source locale. Mojito numeric
locale ids and locale wire objects stay internal.

Unknown optional parameters are forwarded to Mojito for forward compatibility.

## Versioning

`mojito-sdk` follows semver for its own package versions. That version is
independent of Mojito’s. The Mojito HTTP API this build was generated against
is `info.version` in the cached OpenAPI document:

- `getSdkVersion()` — SDK package semver
- `getMojitoVersion()` — Mojito version from OpenAPI `info.version`
- `getCompatibleMojitoRange()` — npm caret of that Mojito version (`^3.4.5`
  means `>=3.4.5 <4.0.0`)
- `isCompatibleMojitoVersion(version)` — whether a live Mojito satisfies that range
- `getOpenApiSpecVersion()` — same string as `getMojitoVersion()`
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

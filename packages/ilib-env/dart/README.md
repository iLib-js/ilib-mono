# ilib_env (Dart)

Dart port of [ilib-env](https://github.com/ilib-js/ilib-mono/tree/main/packages/ilib-env). Same function names and semantics; behavior matches the JS ilib-env on VM and in the browser.

## Design

- **getPlatform()** — On VM returns `"dart"`. On web (compiled to JS in a browser) returns `"browser"`. When run in Node.js (compiled to JS, headless) returns `"node"`. Overridable via [setPlatform].
- **getBrowser()** — On VM returns `null`. On web detects from `navigator.userAgent`: `"firefox"`, `"chrome"`, `"safari"`, `"Edge"`, `"opera"`, `"ie"`, `"iOS"` (same order and names as JS). Cached in scope like JS.
- **getLocale()** — On VM uses `Platform.localeName` in BCP-47 form (`en_US` → `en-US`); `"C"` → `"en-US"`. On web uses `navigator.language` (and IE fallbacks). On Node uses `process.env.LANG` or `process.env.LC_ALL`, parsed to BCP-47 like JS ilib-env. Overridable via [setLocale].
- **getTimeZone()** — On VM uses `Platform.environment['TZ']` when set (IANA id), otherwise `"local"`. On web uses `Intl.DateTimeFormat().resolvedOptions().timeZone`, then `navigator.timeZone` / `navigator.timezone`, else `"local"`. On Node uses `process.env.TZ` or `"local"`. Overridable via [setTimeZone].
- **top()** — Returns the internal scope map used for caching (platform/locale/tz/browser).
- **globalVar(name)** / **isGlobal(name)** — Read from that scope.
- **setPlatform**, **setLocale**, **setTimeZone** — Override platform defaults (e.g. for tests).
- **clearCache()** — Clears overrides so platform values are used again.

The conditional import selects the implementation: **VM** (`dart.library.io`) → `platform_io.dart`; **browser** (`dart.library.html`) → `platform_web.dart`; **Node** (compiled to JS, headless) → `platform_node.dart`. Web uses `dart:html` and `dart:js_util`; Node uses `dart:js_util` to read `process.env`.

## Usage

```dart
import 'package:ilib_env/ilib_env.dart';

void main() {
  print(getPlatform());   // "dart" on VM, "browser" on web
  print(getBrowser());    // null on VM; on web e.g. "chrome", "firefox"
  print(getLocale());    // e.g. en-US (from Platform on VM, navigator on web)
  print(getTimeZone());  // e.g. America/New_York or local (Intl on web when available)

  setLocale('de-DE');
  print(getLocale());    // de-DE

  clearCache();
}
```

## Tests

Tests are split by environment so each file runs in the right context. Scripts live in the **parent** package (`packages/ilib-env/package.json`) so they use the same `node_modules` (and e.g. `npm-run-all`) as the JS package.

**Test environment:** The Dart test scripts set `LANG=kl_GL.UTF-8`, `LC_ALL=kl_GL.UTF-8`, and `TZ=America/Nuuk` (Greenland) before running `dart test`, so VM and Node tests see a consistent locale and timezone regardless of the developer’s system. Greenland is used so few people have it as their system default; you can verify tests read from the environment rather than system. The VM (Linux) and Node (`platform_node`) read these from the environment; ilib_env’s `getLocale()` and `getTimeZone()` pick them up. For **browser** tests, `dart_test.yaml` passes Chrome's/Edge's `--lang=kl-GL` so `getLocale()` should come from the browser; the same script sets `TZ` so the browser process inherits it and `getTimeZone()` (from Intl) should be America/Nuuk. Run tests via the scripts below so the env is applied. If Chrome/Edge do not apply `--lang` in your environment (e.g. some headless setups), the browser locale test skips its assertions so the suite still passes.

| Script | What it does |
|--------|--------------|
| `pnpm run test:dart` | All Dart tests (VM then web) |
| `pnpm run test:dart:vm` | VM-only tests |
| `pnpm run test:dart:web` | All web tests |
| `pnpm run test:dart:web:chrome` | Web tests in Chrome |
| `pnpm run test:dart:web:firefox` | Web tests in Firefox |
| `pnpm run test:dart:web:edge` | Web tests in Edge (script runs only on Windows; on Mac/Linux it skips with a message) |
| `pnpm run test:dart:node` | Node tests (headless; uses `platform_node`) |

There is a **separate test file per browser** (`env_web_chrome_test.dart`, `env_web_firefox_test.dart`, `env_web_edge_test.dart`) and one for Node (`env_node_test.dart`). Each file asserts `getBrowser()` returns the expected name (e.g. `"chrome"`, `"firefox"`, `"Edge"`; null on Node) and includes a test for each cached variable: get default → set with setter → verify getter → `clearCache()` → getter again and verify it returns the default.

Run from the package root (parent of `dart/`):

```bash
cd packages/ilib-env
pnpm run test:dart           # All Dart tests
pnpm run test:dart:vm        # VM only
pnpm run test:dart:web       # Chrome (default)
pnpm run test:dart:web:firefox
pnpm run test:dart:web:edge
pnpm run test:dart:node      # Node.js (headless; getPlatform() == "node", locale/TZ from process.env)
```

The Dart test runner supports **chrome**, **firefox**, **edge**, and **node** for these scripts. **Opera** is not a built-in platform; for Opera-like coverage you can rely on Chrome (Chromium) tests. **Node** runs the same compiled JS in Node.js (no browser); ilib_env uses `platform_node` there (locale from `LANG`/`LC_ALL`, timezone from `TZ`). Edge is available on Windows, Mac, and Linux, but the `test:dart:web:edge` script is set to run only on Windows (on Mac/Linux it skips with a message) to avoid launcher issues; you can install Edge on Mac/Linux and run `dart test --platform edge` from the `dart/` directory if needed.

- **VM** (`test:dart:vm`) — getPlatform() == "dart", getBrowser() == null, getLocale/getTimeZone from platform, setLocale/setTimeZone/clearCache, top(), globalVar, isGlobal.
- **Web** (`test:dart:web:*`) — One test file per browser; getPlatform() == "browser", getBrowser() returns that browser’s name; cached-variable tests (platform, locale, timezone, browser: default → set → clearCache → default). Each browser must be installed.
- **Node** (`test:dart:node`) — getPlatform() == "node", getBrowser() == null; same cached-variable tests.

## License

Apache-2.0 (see parent directory).

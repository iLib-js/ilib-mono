# ilib-localedata

**ilib-localedata** loads iLib locale data in a way that **avoids race conditions** and **avoids reloading** the same files repeatedly. It merges locale fallback chains, caches aggressively (including sharing in-flight loads so concurrent callers do not duplicate work), and performs I/O through **[ilib-loader](https://www.npmjs.com/package/ilib-loader)** so the same code can run on Node, in browsers, with bundlers, and other environments.

Supported locale data styles
--------------------

iLib has evolved on several platforms, so this package understands more than one on-disk shape. All of them can be used with **synchronous** or **asynchronous** loading, depending on the loader and how the data is packaged.

- **Individual raw JSON files** — Typical for Node.js apps: many small files (per locale part and **basename**, or equivalent layouts), loaded sync or async through the loader.

- **Assembled JSON files, one per locale** — A single file per locale contains the locale data your app was configured to need. **Which** basenames and **which** locales are included is decided when you run **[ilib-assemble](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-assemble/README.md)**; at runtime you load one file per locale instead of many fragments. See that package’s documentation in this monorepo for how assembly works.

- **Assembled JS files, one per locale** — Same idea as assembled JSON, but each locale is a **JavaScript module** (modern ES modules). That fits **webpack** and many websites, where JSON often cannot be `import`’d the same way as `.js`.

These styles are **historical and practical**: they cover the different ways iLib has been deployed while still supporting both sync and async loading paths.

Overview
--------------------

**Application code** usually does not call the low-level `loadData` API. The package exists primarily for **other iLib libraries** (date formatting, locale info, and so on) to share one loading and caching implementation.

The common **exception** is startup **preloading**: apps that depend on those libraries often import **`LocaleData`** once and call **`LocaleData.ensureLocale()`** so that all later iLib usage can run **synchronously** without threading `async` through the whole app (see [below](#preloading-locale-data-for-app-developers)).

It is **possible** to use ilib-localedata for **non–iLib** locale data if you adopt compatible file layout and conventions, but that is entirely up to the application developer; the design targets iLib data and packages.

Do **not** rely on loading another package’s raw locale files as a stable API—each package should expose its own documented surface; on-disk basenames and layout are not a contract between packages.

Preloading locale data for app developers
--------------------

If your app uses iLib libraries, you have two broad options: **await** each library call that loads data asynchronously (which pushes async through your own APIs), or **preload** everything once at startup. Preloading uses **`LocaleData.ensureLocale()`**. It loads the same assembled locale files as the rest of the stack (the per-locale `[locale].js` / `[locale].json` bundles), in the same way as `loadData()`, but does it **once**, asynchronously. After that, data lives in the shared cache, so subsequent iLib calls can use **synchronous** code paths—as if the whole stack were sync.

```javascript
import { LocaleData } from 'ilib-localedata';
import { getLocale } from 'ilib-env';

// start of app
const locale = getLocale();
await LocaleData.ensureLocale(locale);

// now you can use ilib libraries as if they were sync-loaded:
const df = new DateFormat({ date: 'long', locale });
const formattedDate = df.format(date);
```

For parameters, failure behavior, and how assembled files are structured, see the **`ensureLocale`** documentation in the [API reference](./docs/ilib-localedata.md).

Installation
--------------------

```bash
npm install ilib-localedata
```

You also need **ilib-loader** (and its peers such as **ilib-env**, **ilib-locale**) so file loading works in your environment (Node, browser, bundler, etc.). Those are declared as dependencies of this package; configure the loader as described in the ilib-loader documentation.

Basic usage
--------------------

The following pattern is what **iLib libraries** use internally. If you are maintaining such a package, get a **singleton** per locale root with the default export `getLocaleData` (do not `new LocaleData()` yourself). Pass the filesystem path to **your** package’s locale directory. Then call `loadData` with a locale and basename; use `sync: true` only where the loader supports synchronous reads (for example Node).

```javascript
import getLocaleData, { LocaleData } from 'ilib-localedata';

// Optional: search additional roots first (e.g. app or OS overrides)
LocaleData.addGlobalRoot('/path/to/custom/locale');

const localeData = getLocaleData({
    path: '/path/to/your-package/locale'
});

// Async (works everywhere)
const data = await localeData.loadData({
    locale: 'de-DE',
    basename: 'info'
});

// Sync, when the loader supports it and data is available
const syncData = localeData.loadData({
    locale: 'de-DE',
    basename: 'info',
    sync: true
});
```

For merge options, roots, `cacheData`, and edge cases, see the [architecture document](./docs/Architecture.md) and [API reference](./docs/ilib-localedata.md).

Architecture
--------------------

For how locale data loading, caching, and packaging fit together, see [Architecture](./docs/Architecture.md).

Full JS Docs
--------------------

To see a full explanation of the LocaleData class, please see
the [full API documentation](./docs/ilib-localedata.md).

Logging
--------------------

Use the name "ilib-localedata" to configure a log4js appender in your app to
see logging output from this library.

## License

Copyright © 2022, 2025-2026 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)

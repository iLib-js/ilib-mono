---
"ilib-loader": minor
"ilib-localedata": patch
---

- Added the ability to have browser-only loaders
  - Browsers can specify to use the webpack loader
    automatically by putting
    `"ilib-loader": "ilib-loader/browser"` in the
    webpack.resolve.alias in the karma configuration.
  - This will avoid dragging in the NodeLoader to the
    webpack bundle, and all of its dependencies making
    for a clean webpack build
  - Loaders now check if the mode is async but the caller
    requests a sync call. In this case, it now throws
    because sync calls are not supported.
- Updated ilib-localedata to set the shared loader mode for sync and async
  calls, and to use already-loaded assembled locale data when sync loading is
  requested from an async-only loader.

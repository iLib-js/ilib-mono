---
"ilib-assemble": minor
---

Added `mergeJson` function that scans an ilib include file to collect required
modules, assembles locale JSON data via `assemble.mjs`, and writes the
merged output into per-locale JSON files.

- A new `--mergeJson` (`-x`) CLI option has been added. When specified,
  `ilib-assemble` runs the `mergeJson` function 
- `ilibPath` option specifies the base directory where `assemble.mjs` is
  located (`js/assembleData/assemble.mjs` relative to that path). Defaults
  to `"./"` when not provided.
- Returns a `Promise` that rejects with a descriptive error if the include file
  cannot be read, or if the assembly/write step fails.
- A new `--splitLocale` (`-s`) CLI option has been added. Must be used together
  with `--mergeJson`; using it alone is an error. When specified, locale data is
  written as a hierarchy of files (`root.json`, `ko.json`, `ko_KR.json`, etc.)
  instead of one merged file per locale.

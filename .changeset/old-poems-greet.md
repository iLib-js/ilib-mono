---
"ilib-assemble": minor
---

Added `mergeJson` function that scans an ilib include file to collect required
modules, assembles locale JSON data via `assemble.mjs`, and writes the
merged output into per-locale JSON files.

- A new `--mergeJson` (`-x`) CLI option has been added. When specified,
  `ilib-assemble` runs the `mergeJson` function 
- `ilibPath` option specifies the base directory where `assembleJson.mjs` is
  located (`js/assembleData/assembleJson.mjs` relative to that path). Defaults
  to `"./"` when not provided.
- Returns a `Promise` that rejects with a descriptive error if the include file
  cannot be read, or if the assembly/write step fails.

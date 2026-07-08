---
"ilib-assemble": patch
---

Fix `--mergeJson` to also resolve `assemble.mjs` from the package root
(`<ilibPath>/assemble.mjs`), so it works against installed ilib packages and
not just the source-tree layout (`<ilibPath>/js/assembleData/assemble.mjs`).

---
"ilib-lint": minor
---

Added a `rules` option to the `resource-sentence-ending` rule to turn individual kinds of violation on or off.
- `ellipsis_mismatch`: a target ending in exactly three ASCII dots (`...`) where the locale expects the Unicode ellipsis (`…`), including targets that end in a closing quote (e.g. `「待って...」`).
- `default`: every violation not listed by name. Defaults to `true`.
- Setting a kind (or `default`) to `false` turns it off entirely: the violation is neither reported as a warning nor auto-fixed.
- Use `{ "default": false, "ellipsis_mismatch": true }` to check only the ellipsis mismatch.
- Four or more trailing dots are not covered by `ellipsis_mismatch` and follow `default`.
- Each `rules` value must be a boolean; non-boolean values (e.g. `0`, `"false"`) are rejected with a warning and ignored, falling back to the default.
- Omitting `rules` keeps the current behavior.

---
"ilib-lint": minor
---

Added a `rules` option to the `resource-sentence-ending` rule to control auto-fixing per kind of violation.
- `ellipsis_mismatch`: a target ending in exactly three ASCII dots (`...`) where the locale expects the Unicode ellipsis (`…`), including targets that end in a closing quote (e.g. `「待って...」`).
- `default`: every violation not listed by name. Defaults to `true`.
- Setting a kind to `false` still reports the warning, but `--fix` leaves the target unchanged.
- Use `{ "default": false, "ellipsis_mismatch": true }` to auto-fix only the ellipsis mismatch.
- Four or more trailing dots are not covered by `ellipsis_mismatch` and follow `default`.
- Omitting `rules` keeps the current behavior.

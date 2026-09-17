---
"ilib-lint": patch
---

`resource-sentence-ending` now honors per-locale off switches in the ruleset
config. Set a locale to `false` to skip the rule for that language, or set a
punctuation type such as `"period": false` (or `null`) to skip only that type
while still checking the others.

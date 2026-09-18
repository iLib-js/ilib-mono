---
"ilib-lint": patch
---

`resource-sentence-ending` can be turned off for one language by setting that
locale to `false` in the ruleset config (for example `"ja-JP": false`). Other
languages still run. Individual punctuation types continue to use `null`.

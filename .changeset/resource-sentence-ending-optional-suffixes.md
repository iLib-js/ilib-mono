---
"ilib-lint": patch
---

`resource-sentence-ending`: Accept either a period or no period after known
fragment endings in Japanese, Korean, and Chinese so the rule no longer flags
valid unpunctuated translations (for example Japanese 場合, Korean 경우, and
Chinese 情况下). Complete sentence endings such as Japanese です and Korean
합니다 are still required to use the locale-appropriate period.

---
"ilib-lint": patch
---

- the error filter transformer was filtering out any resource
  with the same key as one of the results. However, it would do
  this for all locales and across all files, which might represent
  various localization batches.
  - now filters out only the resources for the appropriate
    locale and file

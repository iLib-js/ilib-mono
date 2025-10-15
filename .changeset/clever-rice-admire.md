---
"ilib-tools-common": minor
---

- The Resource.setState() call now throws an exception if you
  set an invalid state. Valid states are ones defined in the
  xliff 1.2 specification, plus a few nonstandard states for ilib
  and mojito, and custom states which must all have the prefix
  "x-".
  - valid states are: needs-translation, needs-l10n, needs-adaptation,
    translated, needs-review-translation, needs-review-l10n,
    needs-review-adaptation, final, new, signed-off, accepted

---
"ilib-lint": patch
---

- handle sentence ending rule much better
  - fixed the handling of its customization in the config
    file so that it can have customized sentence ending
    punctuation per locale
  - fix highlight field in the Result instances produced
  - handles quoted strings better
  - fix a hang caused by treating non-sentence-ending
    punctuation in the source as a period which got the
    linter into a loop in auto-fix mode. It would add a
    period to the translation over and over again which
    still did not match the non-period in the source
    string, causing it to add another period.


---
"ilib-lint": minor
---

- ResourceSentenceEnding rule enhancements to support various exception
  - Added minimumLength configuration option (default: 10) to skip checking short strings/abbreviations
  - Added automatic skipping of strings with no spaces
  - Added exceptions array per locale to skip specific source strings from checking
  - Enhanced punctuation detection for quoted content to handle punctuation after closing quotes
  - Updated rule documentation with new configuration options and examples

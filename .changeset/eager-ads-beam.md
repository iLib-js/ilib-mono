---
"ilib-po": patch
---

Fix character escaping in PO message strings

- Escape backslashes as well as quotes when generating PO output (msgid, msgstr, msgctxt, #k)
- Unescape backslashes and quotes correctly when parsing PO files
- Rename `escapeQuotes` / `unescapeQuotes` to `escapeQuotesAndBackslashes` / `unescapeQuotesAndBackslashes` in utils

---
"ilib-tools-common": minor
"ilib-po": patch
---

Use ilib-tools-common for PO string escaping; add "po" escaper style

**ilib-tools-common**
- Add "po" style to EscapeCommon (RegexBasedEscaper) for GNU gettext PO msgid/msgstr: escape/unescape `\` and `"` only
- EscaperFactory: handle `case 'po'` via RegexBasedEscaper(style)
- RegexBasedEscaper.unescape(): run rules in a loop until stable so C-string/PO semantics are correct (e.g. consecutive backslashes reduce correctly)

**ilib-po**
- Replace local escape/unescape logic in utils with `escaperFactory("po")` from ilib-tools-common
- Declare Escaper, EscaperStyle, and escaperFactory in ilib-tools-common.d.ts; narrow style to EscaperStyle union

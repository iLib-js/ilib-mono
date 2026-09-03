---
"ilib-es6": major
---

Updated to wrap ilib 15.0.0. The version of ilib-es6 always matches the version of ilib that it wraps, so this is a major bump to follow ilib's own major bump from 14.21.0 to 15.0.0.

- Upgraded the pinned `ilib` dependency from 14.21.0 to 15.0.0
- Picks up CLDR 48.2 (previously CLDR 46.0), which changes some locale data. Notably, the script list returned by ScriptInfo.getAllScripts() grew from 223 to 224 entries, and the short-style German duration abbreviations for hours and milliseconds changed from "1 Std." and "1 ms" to "1h" and "1ms"

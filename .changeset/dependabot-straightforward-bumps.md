---
"ilib-loctool-yaml": patch
"ilib-loctool-yaml-resource": patch
"loctool": patch
"ilib-loctool-ghfm-readmeio": patch
---

Bump direct dependencies to patched releases for open Dependabot alerts: `yaml` to ^2.8.3, `js-yaml` to ^4.3.1, and `log4js` to ^6.9.1 (same major as the rest of the monorepo). YAML resource files may omit quotes on keys that the newer `yaml` serializer no longer needs to quote.

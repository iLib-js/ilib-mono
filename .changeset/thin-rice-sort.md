---
"ilib-assemble": patch
---

* Enable `assembleLocaleRootData()` to merge root-level JSON files from `customLocalePath` with the default ilib locale data
* When `customLocalePath` is specified and a matching JSON file exists at its root (e.g., `currency.json`), it is deep-merged with the ilib default data using JSUtils.merge(), with custom data taking precedence

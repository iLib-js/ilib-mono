---
"ilib-zic": major
---

First release of ilib-zic as a standalone package in the ilib-mono monorepo.

- TypeScript port of the Java zone info compiler from monolithic ilib (`com.ilib.tools.zic`), merged with the former Node `gentzinfo.js` enricher into one in-memory pipeline
- Compiles IANA tzdata → enriches (country codes, Windows display names, zonetab, per-country `timezone.jf`) → writes a locale tree in one pass
- CLI: `ilib-zic <src> <localeDir> [--verbose] [--compile-only]` (published as `ilib-zic` because npm `zic` is taken)
- Programmatic `ZoneInfoPipeline` API (or compile / enrich / write stages individually)
- Supports IANA `%z` abbreviation formats (zic `abbroffset`) for numeric UT abbrevs such as `-03/-02`
- Country defaults prefer `zone.tab` primaries; do not follow cross-country Link consolidations for `timezone.jf` or Windows `n`
- POSIX factory Links (`EST`, `CET`, …) are not treated as country-local zone ids
- Depends on `ilib-ctype`, `ilib-common`, `ilib-data-utils`, `cldr-core`, and `json-stable-stringify`
- Includes a CLI sample with a mini tzdata excerpt (including `America/Sao_Paulo` for `%z`) and an e2e snapshot suite

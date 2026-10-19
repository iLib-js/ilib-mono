---
"ilib-zic": major
---

First release of ilib-zic as a standalone package in the ilib-mono monorepo.

- TypeScript port of the Java zone info compiler from monolithic ilib (`com.ilib.tools.zic`)
- Compiles IANA tzdata sources into JSON zoneinfo files used by ilib
- CLI: `ilib-zic <src> <dest> [--verbose]` (published as `ilib-zic` because npm `zic` is taken)
- Programmatic `ZoneInfoCompiler` API plus zone/rule parsing types
- Depends on ilib-ctype for digit checks while parsing relative dates
- Includes a CLI sample with a mini tzdata excerpt (America/New_York, Europe/Paris, Asia/Tokyo) and an e2e snapshot suite

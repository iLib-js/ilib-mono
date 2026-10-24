# ilib-zic

Zone info compiler that converts [IANA tzdata](https://www.iana.org/time-zones)
sources into JSON zoneinfo files used by ilib.

This package is a TypeScript port of the Java tool in
`com.ilib.tools.zic` from the monolithic
[ilib](https://github.com/iLib-js/iLib) repository, plus the former
`gentzinfo.js` enrichment step (country codes, Windows names, zonetab,
timezone.jf).

## Installation

```
npm install ilib-zic

or

yarn add ilib-zic
```

## CLI

```
ilib-zic /path/to/tzdata /path/to/locale [--verbose] [--compile-only]
```

| Argument / option | Description |
|-------------------|-------------|
| `src` | Directory containing unpacked IANA tzdata sources (required) |
| `localeDir` | Locale root to write (`zoneinfo/`, `timezone.jf`, `und/`) (required) |
| `-v, --verbose` | Print progress during compilation |
| `--compile-only` | Skip enrichment; write raw zoneinfo JSON only |
| `-V, --version` | Print version and exit |
| `-h, --help` | Show usage |

On Windows you can also run `ilib-zic.bat` from the package directory.

## Programmatic API

```javascript
import { ZoneInfoPipeline } from "ilib-zic";

const result = new ZoneInfoPipeline({
    srcDir: "/path/to/tzdata",
    localeDir: "/path/to/locale",
    verbose: true,
}).run();

console.log(`Wrote ${result.zoneCount} zones to ${result.localeDir}`);
```

Lower-level APIs (`ZoneInfoCompiler`, `ZoneInfoEnricher`, `LocaleDataWriter`)
are also exported for custom pipelines.

## Development

From the monorepo root:

```
pnpm --filter ilib-zic build
pnpm --filter ilib-zic test
pnpm --filter ilib-zic test:e2e
```

Or from `packages/zic`:

```
pnpm build
pnpm test
pnpm test:e2e
```

## License

Copyright © 2026 JEDLSoft

Licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE)
file for details.

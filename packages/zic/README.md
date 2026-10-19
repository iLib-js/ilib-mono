# ilib-zic

Zone info compiler that converts [IANA tzdata](https://www.iana.org/time-zones)
sources into JSON zoneinfo files used by ilib.

This package is a TypeScript port of the Java tool in
`com.ilib.tools.zic` from the monolithic
[ilib](https://github.com/iLib-js/iLib) repository.

## Installation

```
npm install ilib-zic

or

yarn add ilib-zic
```

## CLI

```
ilib-zic /path/to/tzdata /path/to/zoneinfo [--verbose]
```

| Argument / option | Description |
|-------------------|-------------|
| `src` | Directory containing unpacked IANA tzdata sources (required) |
| `dest` | Output directory for JSON zoneinfo (required) |
| `-v, --verbose` | Print progress during compilation |
| `-V, --version` | Print version and exit |
| `-h, --help` | Show usage |

On Windows you can also run `ilib-zic.bat` from the package directory.

## Programmatic API

```javascript
import { ZoneInfoCompiler } from "ilib-zic";

const compiler = new ZoneInfoCompiler({
    srcDir: "/path/to/tzdata",
    destDir: "/path/to/zoneinfo",
    verbose: true,
});

const result = compiler.compile();
console.log(`Wrote ${result.zoneCount} zones to ${result.destDir}`);
```

## Development

From the monorepo root:

```
pnpm --filter ilib-zic build
pnpm --filter ilib-zic test
```

Or from `packages/zic`:

```
pnpm build
pnpm test
```

## License

Copyright © 2026 JEDLSoft

Licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE)
file for details.

# ilib-assemble Samples

This directory contains sample projects that demonstrate how to use ilib-assemble.

## istring-sample

Demonstrates the standard workflow of using ilib-assemble with an ilib package
(ilib-istring) that has an `assemble.mjs` file. The tool scans the source code
for ilib imports and assembles the locale data automatically.

To run:
```bash
cd istring-sample
pnpm install
pnpm assemble
```

## custom-assemble-sample

Demonstrates using the `--assemble` flag to directly specify an `assemble.mjs`
file. This is useful for:
- Testing ilib-assemble itself
- Including custom locale data that doesn't come from an ilib package
- Bypassing the source code scanning step

To run:
```bash
cd custom-assemble-sample
pnpm install
pnpm assemble
```

## resources-sample

Demonstrates using the `--resources` (`-r`) flag to include translated resource
files in the assembled output. Resource files are typically produced by
localization tools like [loctool](https://github.com/iLib-js/ilib-mono/tree/main/packages/loctool)
and can be loaded at runtime using ilib-resbundle.

To run:
```bash
cd resources-sample
pnpm install
pnpm assemble
```

## legacy-ilib-sample

Demonstrates using the `--legacyilib` flag to assemble data for the monolithic
legacy ilib package (version 14.x). This sample shows how to:
- Specify which ilib modules to include using an inc file
- Configure the paths for the legacy ilib installation
- Generate assembled JavaScript and locale data files

See the [legacy-ilib-sample README](./legacy-ilib-sample/README.md) for detailed
instructions.

To run:
```bash
cd legacy-ilib-sample
pnpm install
pnpm assemble
```


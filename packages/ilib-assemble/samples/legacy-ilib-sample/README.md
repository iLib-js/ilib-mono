# Legacy ilib Sample

This sample demonstrates how to use ilib-assemble with the monolithic legacy
ilib package (version 14.x).

## Prerequisites

This sample requires the legacy ilib package to be installed. The package.json
already includes it as a dependency.

## Usage

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the assembly:
   ```bash
   pnpm assemble
   ```

3. Check the output in the `./locale` directory.

## Configuration

The `ilib-inc.js` file lists which ilib modules to include in the assembled
output. Edit this file to include only the modules your application needs,
which will reduce the bundle size.

## Output

After running `pnpm assemble`, you will have:
- `./locale/ilib-all.js` - The assembled ilib JavaScript code
- `./locale/en-US.js` - Locale data for en-US
- `./locale/de-DE.js` - Locale data for de-DE


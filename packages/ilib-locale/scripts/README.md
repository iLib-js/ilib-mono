# ilib-locale Scripts

Build and test utilities for the ilib-locale package. Run from the package root (`packages/ilib-locale`).

## Generate scripts

| Script | Description | How to run |
|--------|-------------|------------|
| `generate-scripts.js` | Generates `src/scripts.js` from UCD data (ucd-full). Produces ISO 15924 script codes and a script-name-to-code mapping for POSIX locale modifiers. | `pnpm run generate:scripts` |
| `generate-languages.js` | Generates `src/a1toa3langmap.js` from ISO 639 data. Maps ISO 639-1 alpha-2 language codes to alpha-3 (terminological) codes. | `pnpm run generate:languages` |
| `generate-regions.js` | Generates `src/a2toa3regmap.js` from ISO 3166-1 data. Maps alpha-2 region codes to alpha-3 codes. | `pnpm run generate:regions` |

Run all generators at once: `pnpm run generate`

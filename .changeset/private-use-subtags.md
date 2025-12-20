---
"ilib-locale": minor
---

Add support for BCP-47 extension subtags and multiple variants:

- **Extension subtags**: The parser now recognizes extension singletons (`u`, `t`, `x`, etc.) and preserves the entire extension (e.g., `u-co-phonebk`, `t-ja`, `x-pseudo`) as part of the variant.
- **Multiple variants**: Multiple variant subtags are now concatenated together instead of only keeping the last one (e.g., `nedis-rozaj`).
- **Combined support**: Variants and extensions can be combined correctly (e.g., `valencia-u-co-trad`).

This fixes issues where extension subtags like `u-co-phonebk` would corrupt the parsed locale by misinterpreting parts of the extension as language codes.

Additionally:

- **Updated ISO 15924 script codes**: Updated from 203 to 226 script codes using data from Unicode 17.0 (via ucd-full package). New scripts include Kawi, Nag Mundari, Garay, Gurung Khema, Kirat Rai, Ol Onal, Sunuwar, Todhri, Tulu-Tigalari, and others.
- **Added code generation scripts**: Added scripts to auto-generate ISO code files from authoritative npm packages:
  - `scripts/generate-scripts.js` - generates `src/scripts.js` from ucd-full (226 scripts)
  - `scripts/generate-languages.js` - generates `src/a1toa3langmap.js` from @cospired/i18n-iso-languages (184 languages)
  - `scripts/generate-regions.js` - generates `src/a2toa3regmap.js` from iso-3166-1 (249 regions)
  - Run `pnpm generate` to regenerate all code files.


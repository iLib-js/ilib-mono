---
"ilib-locale": minor
---

Add support for BCP-47 extension subtags and multiple variants:

- **Extension subtags**: The parser now recognizes extension singletons (`u`, `t`, `x`, etc.) and preserves the entire extension (e.g., `u-co-phonebk`, `t-ja`, `x-pseudo`) as part of the variant.
- **Multiple variants**: Multiple variant subtags are now concatenated together instead of only keeping the last one (e.g., `nedis-rozaj`).
- **Combined support**: Variants and extensions can be combined correctly (e.g., `valencia-u-co-trad`).

This fixes issues where extension subtags like `u-co-phonebk` would corrupt the parsed locale by misinterpreting parts of the extension as language codes.


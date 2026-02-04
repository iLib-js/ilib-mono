---
"ilib-locale": minor
---

Add support for POSIX locale specifiers:
- `Locale.fromPosix(spec)` - factory method to create Locale from POSIX format (e.g., `en_US.UTF-8@latin`)
- `Locale.isPosixLocale(spec)` - check if string conforms to POSIX locale syntax
- Handles special cases `C` and `POSIX` (mapped to `en-US`)
- Codeset preserved as `x-encoding-<codeset>` private use extension
- Script modifiers (e.g., `@latin`, `@cyrillic`) mapped to ISO 15924 codes
- Non-script modifiers preserved as BCP-47 variants
- Extended `generate-scripts.js` to produce `scriptNameToCode` mapping (258 script names)
- Added TypeScript declarations (`Locale.d.ts`)

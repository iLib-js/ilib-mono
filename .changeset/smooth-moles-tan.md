---
"ilib-scriptinfo": major
---

- Added new package ilib-scriptinfo for script information utilities
  based on ISO 15924 standards.
  - Script information for all 226 Unicode scripts
  - Properties: name, direction, casing, IME requirements
  - TypeScript with full type safety
  - Zero external runtime dependencies; script information is derived at buildtime from
    the latest ISO 15924 script information from the Unicode organization

# Changelog

## 1.0.0

### Major Changes

- 0270710: - Added new package ilib-scriptinfo for script information utilities
  based on ISO 15924 standards.
  - Script information for all 226 Unicode scripts
  - Properties: name, direction, casing, IME requirements
  - TypeScript with full type safety
  - Minimal external runtime dependencies (other than log4js); script information is
    derived at buildtime from the latest ISO 15924 script information from the Unicode
    organization

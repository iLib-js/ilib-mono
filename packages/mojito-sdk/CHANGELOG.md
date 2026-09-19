# mojito-sdk

## Unreleased

### Minor Changes

- Generate the first Mojito SDK implementation from the live OpenAPI spec:
  CLI-compatible auth, generated internal DTOs, and a domain object model for
  repositories, repository types, drops, assets, branches, source strings,
  translations, screenshots, locales, and users.
- Shape the object model so clients only construct `MojitoClient` and domain
  objects: each model class stores the session, nested collections live on
  their container, and the package entrypoint no longer exports transport or
  auth classes.
- Report the Mojito version this SDK was generated against (`info.version` in
  the cached OpenAPI spec) and treat live Mojito servers as compatible when
  they satisfy that version’s npm caret range.
- Use `Locale` from `ilib-locale` throughout the public object model, add
  `MojitoLocale` for repository inheritance, and add repository locale and
  source-locale accessors.

## 1.0.0

### Major Changes

- Create the TypeScript package scaffold for the Mojito SDK.

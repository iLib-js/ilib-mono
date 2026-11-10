# ilib-casemapper

## 1.0.3

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.2

### Patch Changes

- 6bf9033: Migrated package into monorepo.
- Updated dependencies [6bf9033]
  - ilib-locale@1.2.4

## 1.0.0

- Code taken from ilib 14.19.0 and converted to an ES6 module.
- Use Babel to transpile it back to ES5 so it can be used in either ES5 or ES6 code

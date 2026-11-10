# Changelog

## 1.0.2

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.1

### Patch Changes

- efebec7: - Fixed ilib-lint-apple packaging to allow the linter to be able to load it properly

## 1.0.0

### Major Changes

- f398663: - Added new ilib-lint plugin ilib-lint-apple
  - add support for new rule resource-swift-params which
    checks for the existance of \(swift) style of replacement
    parameters and makes sure the target has corresponding
    parameters

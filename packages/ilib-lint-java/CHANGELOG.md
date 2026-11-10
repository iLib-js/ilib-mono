# Changelog

## 1.0.1

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.0

### Major Changes

- 7178996: - Add new ilib-lint-java package
  - Add new rules to chedk Java MessageFormat and Kotlin string template parameters
  - Add new rulesets "java" and "kotlin"

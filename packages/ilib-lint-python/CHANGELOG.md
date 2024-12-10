# ilib-lint-python

## 2.0.2

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1
  - ilib-lint-common@3.1.1

## 2.0.1

- Fixed a bug where the exports were not properly set up in the package.json

## 2.0.0

- Updated dependency from i18nlint-common to ilib-lint-common
  - IntermediateRepresentation now takes a SourceFile as an
    parameter to the constructor instead of a file path
  - can now be loaded by ilib-lint >= v2

## 1.1.2

- updated dependencies
- converted all unit tests from nodeunit to jest

## 1.1.1

- fixed a bug where doubled curly braces (= escaped curly braces) were
  interpreted as replacement parameters
- updated dependencies

## 1.1.0

- updated dependencies
- update to i18nlint-common 2.x which requires the use of an intermediate
  representation

## 1.0.3

- Fixed a bug where a numeric parameter in the target FString, such as
  "{0}" would cause an exception

## 1.0.2

- Fix bug with parsing whitespace in params
  - allow for whitespace in the susbstitution parameter so that
    {name} = { name }
  - match based on the name only, but highlight the whole text of
    the parameter when there is an error

## 1.0.1

- updated dependencies

## 1.0.0

- initial version
- Rules for python resources

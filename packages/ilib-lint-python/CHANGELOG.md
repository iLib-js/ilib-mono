## Release Notes

### v2.0.1

- Fixed a bug where the exports were not properly set up in the package.json

### v2.0.0

- Updated dependency from i18nlint-common to ilib-lint-common
    - IntermediateRepresentation now takes a SourceFile as an
      parameter to the constructor instead of a file path
    - can now be loaded by ilib-lint >= v2

### v1.1.2

- updated dependencies
- converted all unit tests from nodeunit to jest

### v1.1.1

- fixed a bug where doubled curly braces (= escaped curly braces) were
  interpreted as replacement parameters
- updated dependencies

### v1.1.0

- updated dependencies
- update to i18nlint-common 2.x which requires the use of an intermediate
  representation

### v1.0.3

- Fixed a bug where a numeric parameter in the target FString, such as
  "{0}" would cause an exception

### v1.0.2

- Fix bug with parsing whitespace in params
    - allow for whitespace in the susbstitution parameter so that
      {name} = { name }
    - match based on the name only, but highlight the whole text of
      the parameter when there is an error

### v1.0.1

- updated dependencies

### v1.0.0

- initial version
- Rules for python resources

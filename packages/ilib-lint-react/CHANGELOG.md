## Release Notes

### v2.0.1

- Fixed a bug where the exports were not properly set up in the package.json

### v2.0.0

- Updated dependency from i18nlint-common to ilib-lint-common
    - IntermediateRepresentation now takes a SourceFile as an
      parameter to the constructor instead of a file path
    - Parser constructor no longer takes a file path. Instead,
      the Parser.parse method takes a SourceFile parameter
    - can now be loaded by ilib-lint >= v2

### v1.4.2

- fixed a bug where HTML attribute values that are localizable but which
  are empty were marked as hard-coded strings. Now it no longer complains
  about those attribute values unless there is at least one non-whitespace
  character in the string.

### v1.4.1

- fixed a bug where the different parsers did not have unique names
- clarified the documentation about the various parser names and what the
  parsers are used for
- minor documentation updates

### v1.4.0

- added rule to check for usages of FormattedMessage or calls to intl.formatMessage()
  within the children of another FormattedMessage component. That indicates broken
  and unlocalizable strings.

### v1.3.0
- added Typescript and TSX parser
- changed existing JavaScript, JSX, Flow, FlowJSX parsers to all produce Babel-style AST
- added rule to ban usage of FormattedCompMessage
- added rule to check for hard-coded strings and attributes in React code

### v1.2.0

- add a parser for JS or JSX code that uses flow types (FlowParser).
  This parser produces the same ESTree style of AST as the JS and
  JSX parsers.
- update dependencies
- convert unit tests from nodeunit to jest

### v1.1.1

- forgot to expose the properties parser to the consumers of this lib

### v1.1.0

- added a parser for properties files
    - produces an array of Resource instances

### v1.0.0

- initial version
- Parser for jsx and js files
- Rules for react resources

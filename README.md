# ilib-lint-common

Common ilib-lint routines and classes/interfaces that the ilib-lint plugins
will need to implement the plugin functionality.


## Installation

```
npm install ilib-lint-common

or

yarn add ilib-lint-common
```

This package is usually imported by the ilib-lint tool itself or plugins for
the ilib-lint tool.

## Full API Docs

See the [full API docs](./docs/ilib-lint-common.md) for more information.

## License

Copyright © 2022-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

### v3.1.0

- added formatOutput() method to the Formatter class
- added support for updating source files
    - added the setContent() method to the SourceFile class to allow changing the
      content of the file after it has been fixed or filtered. This sets the dirty
      flag on the SourceFile instance so that the write() method of the Parser will
      write the updated content to disk.
    - modified the return value of the write() method of the Parser class to return
      a modified SourceFile instance that is ready to write to disk. The idea is
      that the Parser turns a source file into an IntermediateRepresentation in the
      parse() method, and then the IntermediateRepresentation is turned back into a
      SourceFile in the write() method. This allows the Parser to be stateless and
      to be reused for multiple files. The IntermediateRepresentation is the state
      that is passed from the Parser to the Rules and to then the Fixer, which modifies
      the IntermediateRepresentation to fix the issues found by the Rules. If the Fixer
      introduces any changes to the IntermediateRepresentation, the source file can be
      updated with the fixed content and then written back to disk.
    - added the setRepresentation() method to the IntermediateRepresentation class to
      allow a Fixer or Filter to update the representation of the file.
    - added the Transformer class to allow transforming the IntermediateRepresentation
      into a new IntermediateRepresentation. This allows multiple transformations to
      be applied to the file in sequence, such as filtering out any unwanted content,
      or adding a comment at the beginning of the file that tells the user that
      this is a generated file.
    - added Plugin.getTransformers() method to allow plugins to define transformers
      that can be applied to the IntermediateRepresentation after the Rules are run
      on it

### v3.0.0

- Update major version because of these breaking changes which need to be
  updated in the plugins:
    - Added a SourceFile class to represent the original source file
      that is being parsed. This gives access to the raw bytes of the file,
      the file represented as a single string in Unicode, or to the file
      as an array of lines in Unicode.
    - Parser constructor no longer takes a filePath argument in the
      options object. Instead, the parse() method now takes a SourceFile
      argument. This means that ilib-lint will only create 1 instance of
      the parser instead of one per source file as it did before. It will
      then call the parse method multiple times with different source
      files to produce the intermediate representations of that file
    - The IntermediateRepresentation constructor no longer takes a filePath
      argument in the options object as well. Instead, it takes a SourceFile
      instance, giving the IntermediateRepresentation and any class that
      uses it access to the original raw content of the file or the
      representation of the file as a string or an array of lines. This will
      make it easier for Fixer and Fix instances to operate on the original
      file and for the Rules to generate the correct snippets of the original
      file to show where the issue occurred.
- renamed from i18nlint-common to ilib-lint-common to go along with the name of
  the tool

### v2.2.1

- changed the documentation for the return value of getRules and getFormatters
  so that it can be an array of classes or objects that definition declarative
  rules or formatters. This was already the case, but not documented properly.
- updated dependencies
- converted all unit tests from nodeunit to jest

### v2.2.0

- added Fix and Fixer to allow implementing auto-fixing of Results

### v2.1.0

- added the FileStats class
- added fields to the Result object for the location of the issue

### v2.0.1

- fix a problem where you could not create a Result instance with a
  lineNumber equal to 0.

### v2.0.0

- added Parser.getType() method
- clarified some jsdocs
    - Rule.match() should return a Result instance, an array of
      Result instances, or undefined if no match
- added IntermediateRepresentation class to represent the results of
  parsing a file
- Parser.parse() should now return the intermediate representation
    - this requires the plugins to change, so the major version is bumped
- Added support for logging provided by the lint tool so that plugins
  can use the linter's logging
    - getLogger() function passed to the constructors

### v1.4.0

- added utility function withVisibleWhitespace() to visually represent whitespace characters
- added isKebabCase(), isSnakeCase(), and isCamelCase() utility functions

### v1.3.0

- added getLink() method to the Rule class

### v1.2.0

- update the plugin to return only classes, as the linter may need to instantiate
  the classes multiple times
- add the getRuleSets() method to the plugin to allow the plugins to define
  standard rule sets

### v1.1.0

- added methods to abstract classes needed for loading and testing the plugins

### v1.0.0

- initial version
- define initial code and default built-in rules

# ilib-lint-common

## 3.7.0

### Minor Changes

- 7658dff: - Added "param" property to the constructor of a Rule
  - gives the parameters from the ilib-lint-config file
  - preserves the type of the parameter
  - previously, it was ambiguous how the parameters
    would get passed to the rule constructor

## 3.6.0

### Minor Changes

- a164407: Allow updating the `dirty` flag on `IntermediateRepresentation`

## 3.5.0

### Minor Changes

- 9212dff: - Serializer plugins can now throw an Error if the
  data they are trying to serialize is insufficient
  or the output file cannot be generated

## 3.4.0

### Minor Changes

- b182d42: - Added support for counting the number of source words
  in the FileStats object

## 3.3.0

### Minor Changes

- f6c2fc0: - Added IntermediateRepresentation.isDirty flag
  - can document whether or not a representation differs from an
    original representation
  - also added IntermediateRepresentation.isDirty() method

## 3.2.0

### Minor Changes

- 4a41879: - Updated Serializer API and clarified docs
  - Added the ability for SourceFile.write() to make the
    directories along the path where it wants to write
    the file if they don't exist already.
  - Added unit tests for SourceFile.write()
  - Updated Transformer API to add a results parameter
    to the transform() function so that the transformer
    can do things based on these results

## 3.1.2

### Patch Changes

- f9f1095: Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
- ae2549a: Fixed broken links in package metadata.

## 3.1.1

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 3.1.0

- added formatOutput() method to the Formatter class
- added support for updating source files
  - made sure that SourceFile and IntermediateRepresentation instances are immutable
  - added the Transformer class to allow transforming the IntermediateRepresentation into a
    new IntermediateRepresentation. This allows multiple transformations to
    be applied to the file in sequence, such as filtering out any unwanted content,
    or adding a comment at the beginning of the file that tells the user that
    this is a generated file.
  - added the Serializer class to serialize the IntermediateRepresentation back into a SourceFile
  - added Plugin.getTransformers() method to allow plugins to define transformers
    that can be applied to the IntermediateRepresentation after the Rules are run
    on it
  - added Plugin.getSerializers() method to allow plugins to define serializers
    that can be applied to the IntermediateRepresentation after the Transformers
    are run on it
  - added PipelineElement class to ensure that Parser, Transformer, and Serializer
    classes all have the same interface in terms of names, descriptions, and
    types.

## 3.0.0

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

## 2.2.1

- changed the documentation for the return value of getRules and getFormatters
  so that it can be an array of classes or objects that definition declarative
  rules or formatters. This was already the case, but not documented properly.
- updated dependencies
- converted all unit tests from nodeunit to jest

## 2.2.0

- added Fix and Fixer to allow implementing auto-fixing of Results

## 2.1.0

- added the FileStats class
- added fields to the Result object for the location of the issue

## 2.0.1

- fix a problem where you could not create a Result instance with a
  lineNumber equal to 0.

## 2.0.0

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

## 1.4.0

- added utility function withVisibleWhitespace() to visually represent whitespace characters
- added isKebabCase(), isSnakeCase(), and isCamelCase() utility functions

## 1.3.0

- added getLink() method to the Rule class

## 1.2.0

- update the plugin to return only classes, as the linter may need to instantiate
  the classes multiple times
- add the getRuleSets() method to the plugin to allow the plugins to define
  standard rule sets

## 1.1.0

- added methods to abstract classes needed for loading and testing the plugins

## 1.0.0

- initial version
- define initial code and default built-in rules

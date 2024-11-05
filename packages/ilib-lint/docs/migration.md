# Migrating Plugins

## From v1 to v2 of ilib-lint

The following changes need to made to your plugins:

- Update dependency from i18nlint-common version 2.* to ilib-lint-common 3.0.0
- Update all imports from "i18nlint-common" to "ilib-lint-common" in all files
- In your Parser subclasses:
    - add an import of `SourceFile` from 'ilib-lint-common`
    - Remove handling for the filePath argument to the constructor
    - add a "sourceFile" argument to the parse() method
    - instead of reading the file directly, use sourceFile.getContent()
      to get the content of the file as a string
    - pass a sourceFile property to the constructor of an
      IntermediateRepresentation instead of a filePath property
- In your Rule subclasses:
    - Change any references to `ir.filePath` to `ir.sourceFile.getPath()`
- In your package.json:
    - Make sure your `exports` property allows for direct importing of
      of the package.json file. Ilib-lint checks your dependencies to see
      if it depends on ilib-lint-common instead of i18nlint-common. If
      it depends on i18nlint-common, ilib-lint will assume that it is an
      older plugin and refuse to load it.
    - the exports property should look something like this:

```json
"exports": {
    ".": {
        "import": "./src/index.js"
    },
    "package.json": {
        "import": "./package.json"
    }
}
```

- In your test files:
    - add an import of `SourceFile` from 'ilib-lint-common`
    - Remove `filePath` from the constructor parameters of Parsers
    - When testing a parser, create an instance of SourceFile and pass it
      in to the Parser.parse method as the content to parse
    - Also pass it in to any IntermediateRepresentation instances the
      tests create.
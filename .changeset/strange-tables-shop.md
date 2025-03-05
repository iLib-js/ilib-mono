---
"ilib-lint": minor
---

- Added the ability to write files out again if they
  are modified and a serializer is available
  - added the --write flag to cause the write to happen
  - added the --overwrite flag to cause it to overwrite
    the original file (otherwise, it writes to another
    parallel file)
  - modified the ouput of --list to output the names
    of known serializers that are built-in or loaded from
    plugins
  - file type definitions can now include a property that
    names the serializer to use to write out files of
    that type
  - file type definitions can now only use plugins that
    operate on the same type of intermediate representation
    types. That is, you cannot specify a parser that produces
    a "line" representation type, and then a serializer
    that accepts a "resource" representation type. They all
    have to be "line" or "resource".

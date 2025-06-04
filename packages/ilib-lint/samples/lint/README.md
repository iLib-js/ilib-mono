# Ilib-lint Sample

A sample to demonstrate how to call and use the ilib-lint tool to find
i18n problems in your code.

The lint tool can check for problems in xliff files, or in source files
of various types, based on plugins.

# Usage

## Reporting on Problems

To run the sample, first run `npm install` to install the lint tool
and the python plugins for it.

Then simply call:

```
$ npm run lint
```

This will run the lint tool on the current project and report back a
number of problems that have been purposely put there to demonstrate
each type of problem.

The file src/prime.py is the source code for this sample. You can use
the django extraction tool to create a .po file out of the strings
which can subsequently be localized with the loctool.

The directory `xliffs` contains translations of those strings with
the problems built into them. The strings in there demonstrate not
only the problems with python strings, but also with resources in
general. For example, they contain problems with python placeholder
syntax, as well as general problems such as placeholders that exist
in the source strings but not the target string.

The `ilib-lint-config.json` file configures the lint tool to be able
to load the plugins it needs and to understand what to check and which
rules to apply. Take a look at it to better understand a working
example of this file.

## Filtering Out Some of the Problems

Some of the problems can be automatically filtered out using the
new ErrorFilterTransformer plugin for the lint tool. To run it, call:

```
$ npm run lint:fix
```

This will run the linter, collect the results, print them to the
console, then delete the parts of the xliff files that have problems.
After this run, you will be able to do `git diff` and see the
translation units that had error level problems in the output
were deleted.

The filtering is accomplished by two things:

- In the file type definition, add in the error filter transformer
  and the xliff serializer. These tell the linter how to run the error
  filter and how to write out any modified files. If files are not
  modified, no output is generated.
- On the command-line, give the `--overwrite` flag, which tells
  the linter to overwrite the files with the filtered versions of them,
  correcting them in-place. If you use the `--write` flag instead,
  it will create a new, parallel file with a `.modified` extension
  that is the filtered version of the file and it will leave the
  originals alone.

Here is what the new file type definition for xliff files looks
like:

```json
{
  "filetypes": {
    "xliff": {
      "parsers": ["xliff"],
      "ruleset": [
        "generic",
        "python",
        "python-gnu",
        "overrides"
      ],
      "transformers": [ "errorfilter" ],
      "serializer": "xliff"
    }
  }
}
```

## License

Copyright © 2023-2025, JEDLSoft

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

### v2.2.0

- added support for demonstrating filtering based on error results

### v2.1.0

- added samples to demonstrate the new snake case, camel case,
  and kabob case rules

### v2.0.0

- added support for ilib-lint v2.0.0
- can now parse source code files and lint them as well, not just
  xliff files
    - included a sample jsx file parsed by the JSXParser provided
	  by the ilib-lint-react plugin, and using rules implemented
	  in the same plugin

### v1.1.0

- added more sample problems in the xliff files
- updated dependencies

### v1.0.0

- Initial version

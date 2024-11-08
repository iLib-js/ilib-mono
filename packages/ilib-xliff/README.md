# xliff

A parser and generator for xliff files (XML Localization Interchange Format File)

## API Documentation

Full API documentation can be found [here](./docs/ilibXliff.md).

## License

Copyright © 2022-2023, JEDLSoft

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

### v1.2.0
- added support for parsing inline content markup in XLIFF 1.2 (`<x />` etc.)
- added support for parsing CDATA content in XLIFF 1.2 (`<![CDATA[<foo />]]>`)

### v1.1.0

- add support for the "translate" flag on translation units
- fixed the API documentation to be more useful
- added getLines() method to count the number of lines in the original
  xml if this is being used to parse the xliff file
- added "location" information of the start of each translation unit
  in the xml file
    - gives line number and character within the line of each
      trans-unit (v1.2) or unit (v2.0) element in the file

### v1.0.0

- initial version copied from loctool 2.18.0
- converted to ESM

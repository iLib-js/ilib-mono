# ilib-tmx

A parser and generator for tmx files (Translation Memory eXchange)

## API Documentation

Full API documentation can be found [here](./docs/ilibTmx.md).

## License

Copyright © 2023-2024, JEDLSoft

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

### v1.1.3

- fixed a problem where the library did not come with ES2015 code
  so require("ilib-tmx") would not work

### v1.1.2

- converted all unit tests from nodeunit to jest
- now only supports node >= v14.0.0

### v1.1.1

- fixed multiple bugs:
    - when reading TMX files which did not have the header
      attribute "srclang", it would put all of the translation
      variants into the same translation unit
    - if the srclang attribute does exist and also exists on
      the translation unit, and they are different, it put the
      wrong locale onto the translation unit instance
    - it ignored the adminlang attribute if it was there
    - it put the wrong datatype onto the translation units

### v1.1.0

- added new method diff() to return a new TMX instance that contains
  the differences between the other TMX and the current one
- added new method merge() to return a new TMX instance that contains
  the superset of all of the translations units from the current instance
  and any given instances
- bug fix: was not parsing the header or the translation unit properties
  properly during deserialization

### v1.0.0

- initial version copied from loctool 2.18.0
- converted to ESM

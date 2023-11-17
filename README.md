# ilib-data-utils

Utility library that provides classes and functions used to generate
locale data files.

Full JS Docs
--------------------

To see a full explanation of the classes and functions, please see
the [full API documentation](./docs/ilib-data-utils.md).

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

- added the ability to parse Unicode data files that have continuation
  comments. These are introduced with an initial comment char at the
  beginning of a line, and are continued with empty fields in the
  subsequent lines. They end when there is a line that does not contain
  an empty field.
- fixed a bug where @ was always considered a comment character in the
  UnicodeFile class, even if a different comment char was passed in to
  the constructor
- fixed a bug where empty fields at the beginning of a line would get
  trimmed if the field separator char was a whitespace char, such as the
  tab char, which threw off all the fields in that line

### v1.1.0

- added localeMergeAndPrune which uses the Utils.getSublocales to build
  the locale hiearchy first, and merge and prune based on the locales.
  This echoes the way that ilib loads locale data files.
  The older mergeAndPrune only merges from root -> lang -> 
  lang-script -> lang-script-region
  Specifically, it did not include the und-region locale in the hierarchy
  which means it was not merging and pruning the same way that ilib
  was loading the data.

### v1.0.0

- Initial version

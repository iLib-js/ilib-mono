# ilib-loctool-javascript-resource

ilib-loctool-javascript-resource is a plugin for the loctool that
allows it to read and localize javascript resource files.

## Release Notes

### v1.0.5

- update dependencies

### v1.0.4

- Add the ability to specify the locale to the JavaScriptResourceFileType.newFile() method
- Add the ability to specify the path name of the caller has already calculated what it
  should be. This is so that the caller can implement output mappings and specify the
  output file name for the resource file
- Updated dependencies
- Min version of node is 10 now

### v1.0.3

- Fixed bug where the resource directory generate incorrectly.

### v1.0.1

- Fixed bug where JavscriptResourceFileType.getExtracted and getNew and getPseudo were returning
undefined instead of an empty translation set.

### v1.0.0

- Initial release

## License

Copyright © 2019, 2021 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

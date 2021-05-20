# ilib-common

Various utility classes for the ilib packages.

## Installation

```
npm install ilib-common

or

yarn add ilib-common
```

## License

Copyright © 2021, JEDLSoft

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

### v1.0.1

- API documentation updates
- now can test on web browsers easily
- fixed bug in `MathUtils.significant()` where it was calling functions
  using the "MathUtils" namespace instead of local functions
- fixed tests for hash codes to work inside of a webpacked test

### v1.0.0

- initial version
- copied from ilib 14.7.0
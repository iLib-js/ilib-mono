# ilib-common

Various utility classes for the ilib packages.

## Installation

```
npm install ilib-ctype

or

yarn add ilib-ctype
```

## CType Functions

The CType functions are modeled after the posix ctype functions for C/C++.
The data for all of the CType functions are derived from the Unicode
Character Database so that they can be called with any character in
Unicode. (Many posix implementations do not support Unicode!)

Because Javascript does not have an intrinsic character type, the arguments
for these functions are strings. Only the very first character in the
string is examined to determine the output of the function. The rest of
the string is ignored.

The functions are as follows:

- isAlnum - is the character alpha numeric?
- isAlpha - is the character alphabetic?
- isAscii - is the character part of the ASCII subset?
- isBlank - is the character blank?
- isCntrl - is the character a control character?
- isDigit - is the character a digit?
- isGraph - is the character a graphic character?
- isIdeo - is the character an ideographic (Asian) character?
- isLower - is the character lower-case? For scripts that do not have
  the concept of cases, this always returns true.
- isPrint - is the character printable on the screen?
- isPunct - is the character a punctuation character?
- isScript - does the given character belong to the named script?
- isSpace - is the character a whitespace character?
- isUpper - is the character upper-case? For scripts that do not have
  the concept of case, this always returns true.
- isXdigit - is this character a hexadecimal digit?

Additionally, there is a `withinRange()` function which returns 
true if the given character is within the named Unicode range. 

```javascript
import { withinRange } from 'ilib-ctype';

console.log(withinRange("\uFE2A", "HalfMarks")); // prints true
```

## Using the CType Functions

All of the functions are exported from the package in general. Here is
an example of how you would use the `isAlpha` function.

```javascript
import { isAlpha } from "ilib-ctype";

console.log(isAlpha("a"));   // prints true
console.log(isAlpha("3"));   // prints false
```

If you are using ilib-ctype with webpack or any other packaging tool
and do not want to include the entire package with all of its
associated data when you only need just one function, then
you can minimize your footprint by importing that function directly:

```javascript
import isDigit from 'ilib-ctype/lib/isDigit';

console.log(isDigit("2")); // prints true
```

That will only drag in the `isDigit` function, the `withinRange` function,
and the ctype_n.json file (2K compressed). All the rest of the data
will not be dragged in to your package.

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

### v1.0.0

- initial version
- copied from ilib 14.8.0
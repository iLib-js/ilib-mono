# ilib-locale

A BCP-47 locale specifier parser and validator. BCP-47 locale specifiers
are also known as IETF locale tags.

## Installation

```
npm install ilib-locale

or

yarn add ilib-locale
```

## Parsing Locale Specifiers

Here is how you load ilib-locale:

```javascript
ES2015:

var Locale = require("ilib-locale");
var l = new Locale("ja-JP");

ES6:

import Locale from 'ilib-locale';
var l = new Locale("ja-JP");
```

Here is how you use ilib-locale to parse locale specifiers:

```javascript
var l = new Locale("zh-Hans-CN");
console.log("Language: " + l.getLanguage()); // outputs "zh"
console.log("Script: " + l.getScript()); // outputs "Hans"
console.log("Region: " + l.getRegion()); // outputs "CN"
```

Full documentation: [Locale class](./docs/Locale.md)

## The Current Locale

To get the default locale of the platform, simply make a new Locale instance
without parameters.

```javascript
var locale = new Locale();

console.log("Current locale is " + locale.getSpec()); // output "Current locale is en-US" in the US
```

This module uses `ilib-env` to determine what the current platform is, and looks
in the appropriate place for the locale specifier. For most modern browsers and
recent versions of nodejs, this comes from the `Intl` object, which retrieves
the locale from the environment variables or operating system.

## Constructing a Locale

If you have the locale parts and would like to construct a locale specifier, pass the
parts to the constructor:

```javascript
var language = "sr";
var script = "Cyrl";
var region = "SR";
var variant = "u-sort-old";

var locale = new Locale(language, region, variant, script);

console.log("Locale spec is " + locale.getSpec()); // output "Locale spec is sr-Cyrl-SR-u-sort-old"
```

## Validating a Locale

If you have a string and you would like to validate that it forms a valid BCP-47 tag,
you can use the `isValid` method to do that:

```javascript
var l = new Locale("mn-XM");

console.log("Locale is valid: " + l.isValid());
// output "Locale is valid: false" because XM is not a valid region code
```

In order for a locale spec to be valid, each of its parts needs to conform to the
codes in the ISO standard that governs that part:

- Language. Language codes must be one of the [two-](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) or 
  [three-](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) lower-case letter codes from the
  [ISO 639](https://en.wikipedia.org/wiki/ISO_639) standard.
- Script. Script codes must be one of the four letter codes from the
  [ISO 15924](https://en.wikipedia.org/wiki/ISO_15924) standard.
- Region. Region codes must be one of the two upper-case letter codes from the
  [ISO 3166](https://en.wikipedia.org/wiki/ISO_3166) alpha-2
  standard or a 3 digit code from the [UN M49](https://en.wikipedia.org/wiki/UN_M49)
  standard or the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) numeric-3 standard.


# License

Copyright © 2021-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

# Release Notes

### v1.2.3

* Convert all unit tests from nodeunit to jest
* added ability to run tests on browsers via karma

### v1.2.2

* This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

### v1.2.1

* Removed dependency on polyfills that are not needed, which should make this
  easier to depend upon.

### v1.2.0

* Now ships both the ES6 modules in the src directory and the commonjs code
  (transpiled with babel) in the lib directory. Callers can choose which one
  they would like to use.

### v1.1.1

* Update dependencies and target the right node & browser versions with babel

### v1.1.0

- added the ability to parse locale specs that contain underscores
  instead of dashes. Some locale specs for Java properties file names
  or in some gnu gettext libraries are specified with underscores.
  (ie. "zh_Hans_CN" === "zh-Hans-CN" now)
- updated dependencies

### v1.0.2

- fixed some incorrect unit tests

### v1.0.1

- do not put the module name into the package.json, because it screws
up the import of ilib-locale in other apps that use webpack
- added API documentation
- added new way of doing web testing using a webpacked version of the tests

### v1.0.0

- Code taken from ilib 14.7.0 and converts to an ES6 module.
- Use babel to transpile it back to ES2015 so it can be used in either ES215 or 
  ES6 code

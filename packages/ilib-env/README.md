# ilib-env

Detect various things in the runtime environment.

## Usage

This package can be used to detect the following things:

- The current platform
- The current locale
- The current time zone
- The current browser
- The top scope and whether variables are global in the current environment

See the [full API documentation](./docs/ilibEnv.md).

## Installation

```
npm install ilib-env

or

yarn add ilib-env
```

### The Current Platform

Return the name of the platform upon which the code is currently running.

```javascript
ES2015:

var ilibEnv = require("ilib-env");
var platform = ilibEnv.getPlatform();

ES6:

import { getPlatform } from 'ilib-env';
const platform = getPlatform();

or

import ilibEnv from 'ilib-env';
const platform = ilibEnv.getPlatform();
```

This will return a string that names the platform upon which the package is running.
The string will have one of the following values:

- browser: this code is running in a browser. Use getBrowser() to you need to know which one.
- nodejs: this code is running on nodejs
- qt: this code is running under QML inside of QT
- rhino: this code is running inside of Rhino or Nashorn
- trireme: this code is running inside of Trireme
- unknown: the platform is not recognized
- webos-webapp: the code is running in a web application on WebOS
- webos: the code is running in a WebOS app

### The Current Locale

Return the BCP-47 locale specifier for the platform on which this code is running.

```javascript
ES2015:

var ilibEnv = require("ilib-env");
var locale = ilibEnv.getLocale();

ES6:

import { getLocale } from 'ilib-env';
const locale = getLocale();

or

import ilibEnv from 'ilib-env';
const locale = ilibEnv.getLocale();
```

If the platform supports the `Intl` object, this function will use it to determine
the current locale. (This includes most modern browsers and nodejs). If there is no
`Intl` object, or the locale is not specified in the `Intl` object, this function
will check various environment variables to find the locale. If none can be found,
it will return a default of "en-US".

### The Current Time Zone

Return the IANA timezone specifier for the platform on which this code is running.

```javascript
ES2015:

var ilibEnv = require("ilib-env");
var timezone = ilibEnv.getTimeZone();

ES6:

import { getTimeZone } from 'ilib-env';
const timezone = getTimeZone();

or

import ilibEnv from 'ilib-env';
const timezone = ilibEnv.getTimeZone();
```

If the platform supports the `Intl` object, this function will use it to determine
the current timezone. (This includes most modern browsers and nodejs). If there is no
`Intl` object, or the timezone is not specified in the `Intl` object, this function
will check various environment variables to find the timezone. If none can be found,
it will return a default of "local".

### The Current Browser

Return the name of the browser on which this code is running. If the code is not
runningn on a browser (ie. the getPlatform() function does not return "browser")
then the return value of this function is undefined.

```javascript
ES2015:

var ilibEnv = require("ilib-env");
if (ilibEnv.getPlatform() === "browser") {
    browser = ilibEnv.getBrowser();
}

ES6:

import { getPlatform, getBrowser } from 'ilib-env';
if (getPlatform() === "browser") {
    browser = getBrowser();
}

or

import ilibEnv from 'ilib-env';
if (ilibEnv.getPlatform() === "browser") {
    browser = ilibEnv.getBrowser();
}
```

This function returns one of the following values:

- firefox
- opera
- chrome
- ie
- safari
- Edge
- iOS

If the browser name cannot be determined, this function returns undefined

### The Top Scope

You can retrieve the top scope of the platform using the `top()` function
and you can check whether or not a variable is defined in the top scope
using the `isGlobal()` function.

```javascript
ES2015:

var ilibEnv = require("ilib-env");
var top = ilibEnv.top();
if (ilibEnv.isGlobal("variableName")) {
    // safe to reference variableName
}

ES6:

import { top, isGlobal } from 'ilib-env';
const top = top();
if (isGlobal("variableName")) {
    // safe to reference variableName
}

or

import ilibEnv from 'ilib-env';
const top = ilibEnv.top();
if (ilibEnv.isGlobal("variableName")) {
    // safe to reference variableName
}
```

## License

Copyright © 2021-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

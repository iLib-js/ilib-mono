# ilib-localeinfo

Encode basic locale-specific information that can be used to write
locale-friendly classes.

Usage
=====

To use the LocaleInfo class, simply create a new instance and pass
in the locale you are interested in:

```javascript
// es6
import LocaleInfo from 'ilib-localeinfo';

const li = new LocaleInfo("ja-JP");


// old school Javascript
var LocaleInfo = require("ilib-localeinfo");

var li = new LocaleInfo("ja-JP");
```

This will return an object that you can query for the following
information:

- English name of the language or the region for the locale
- Whether the locale uses a 12 or 24 clock by default
- Which measurement system (units) the locale uses. Choices are:
  uscustomary, imperial, metric. Most of the world uses "metric" of
  course, but a few still use non-metric measurement systems.
- What type of calendar the locale uses. Most use "gregorian" but a
  few do not.
- What day of the week does the week start on (ie. what is the first
  column in a calendar)
- Which days of the week start and end the weekend. You can infer the
  weekdays from this as well
- What is the default time zone for the locale. Most locales have only
  one time zone because the country is not big enough for more than one.
  A few countries (currently 23) have multiple time zones.
- What currency is legal tender in this locale
- What writing script is most commonly used to write this language, and
  also which script is used with the current locale spec. You can also get
  an array of all the scripts used to write the current language.
- What type of meridiems are used in the locale. Meridiems are the "am" and
  "pm" used with 12-hour clocks. Some locales have more categories than just
  "am/pm" especially for more traditional clocks.
- What paper size is used in most printers in this locale
- What characters start off quotes and end quotes in this locale

Sync vs. Async
--------------

All of the locale info data for all locales is over 10 megabytes, so to reduce the
memory footprint, this data is not included statically into the library. To get
the locale info for each locale, this package loads locale data files from disk.

Some platforms can support loading files both synchronously and asynchronously.
The usage above (calling the constructor) shows the synchronous usage. To
create a LocaleInfo instance asynchronously, use the static factory
method `create` which takes the same parameters as the constructor and returns
a Promise:

```javascript
// es6
import LocaleInfo from 'ilib-localeinfo';

LocaleInfo.create("ja-JP").then(li => {
    // do something with the li instance
});


// old school Javascript
var LocaleInfo = require("ilib-localeinfo");

LocaleInfo.create("ja-JP").then(function(li) {
    // do something with the li instance
});
```

Every platform is able to load files asynchronously. Additionally, you may
use sync mode under nodejs.

Caching
-------

Locale data in ilib classes is cached. That means that after you have loaded
the data for a particular locale the first time, you can create new instances of
LocaleInfo for the same locale again without reloading those same locale data
files.

It also means that you create LocaleInfo instances synchronously for the same
locale from that point onwards, even if your platform does not support
synchronous file loading.

There are two other ways of getting the data into the cache:

1. adding statically included data into the cache
1. ensuring the locale

#### Statically Included Data

If your locale support is very small (rule of thumb: 4 or less locales), you may
want to just include the locale data statically in your app and be done with it.
To do this, use `ilib-assemble` as per the instructions below to create
single files containing all the data for particular locales. Then, explicitly
import those files in your app. At the beginning of the app, you can then
explicitly add the data to the ilib cache and start instantiating ilib classes
synchronously.

Example of adding data for 2 locales to the cache:

```javascript
import { LocaleData } from 'ilib-localedata';
import englishData from './locale/en-US';
import japaneseData from './locale/ja-JP';

// cache the data using the static method cacheData
LocaleData.cacheData(englishData());
LocaleData.cacheData(japaneseData());

// Now you can use LocaleInfo synchronously for
// the rest of the app, even in webpack
const li = new LocaleInfo("ja-JP");
```

#### Ensuring the Locale

If your locale support is larger (5 or more locales), and you do not want
to statically include all of the data into your app, yet you still want to
use the ilib classes synchronously, then you can use the static method
`LocaleData.ensureLocale()` to load the locale data asynchronously,
and use the ilib classes synchronously after the promise is resolved.

Example:

```javascript
import { LocaleData } from 'ilib-localedata';

// tell ilib where the output from ilib-assemble lives
LocaleData.addGlobalRoot("./locale");

// load the files into cache asynchronously
const locales = ["en-US", "ja-JP"];
let promise = Promise.resolve(true);
locales.forEach(locale => {
    promise = promise.then(() => {
        return LocaleData.ensureLocale(locale);
    });
});

promise.then((result) => {
    // Now you can use LocaleInfo synchronously for
    // the rest of the app, even in webpack
    const li = new LocaleInfo("ja-JP");
});
```

Using This Package Within Webpack
=================================

You can use this package within your webpacked application as well.

However, as we mentioned in the previous section, the locale data is large,
so you would probably not want to include it all in your webpacked application
statically, nor would you want to load it all at once. The strategy to deal
with this is to extract a subset of that data to include with your
application, put that data into webpack chunks and then lazy load those
chunks when needed.

To accomplish extracting the right subset, you would use the new tool
`ilib-assemble`. This tool will scan the source code for your application
to find references to ilib packages. It will then find each of those ilib
packages in the `node_modules` directory, and ask each to return the
requested locale data. If the ilib package has no
loadable locale data, it will return nothing. If it does, then that package
will include its own data into the overall set that the assemble tool is
collecting. In this
way, multiple ilib packages can add their own data into the collected
set and this superset of all of the data will be loaded in your application
when the locale data for a particular locale is loaded.

The `ilib-assemble` tool is called with a list of locales that your
application would like to support. It will only include the data for those
locales for each package.

Together, the idea of only scanning the ilib packages your application needs
and only including the data for the subset of locales that your application
supports, the actual data included into your webpacked application can be
much smaller than all of the data for the whole world.

Using ilib-assemble
-------------------

The tool `ilib-assemble` is used to collect all the locale data that your app
will need. To install it, just use your favorite package manager to add it
to the "devDependencies" in your `package.json` file.

To run `ilib-assemble`, add a script in your package.json similar to this:

```javascript
    "scripts": {
        "assemble": "ilib-assemble --localefile locales.json ./locale ./src",
    }
```

The basic usage for the ilib-assemble tool is:

```
ilib-assemble target-directory [ source-directory ... ]
```

See the [ilib-assemble documentation](https://github.com/ilib-js/ilib-assemble)
for the details of all of the available command-line parameters.

Locales can be specified directly on the command-line with a comma-separated
list using the `--locales` parameter. However, that list could get very long and
unwieldy for the command-line. An alternate method for specifying the list of locales
is to using a `locales.json` file. This file has a very simple format. It contains
an array called "locales", which lists out the locale specs for all the locales
you would like your app to support. Example:

```json
{
    "locales": [
        "en-US",
        "de-DE",
        "ja-JP",
        "zh-Hans-CN"
    ]
}
```

This above command will scan all source files in the `./src` directory for references
to any ilib packages. It will then find each ilib package in your `node_modules`
directory, and ask it to return the locale data for the specified locales. When it
has done collecting all of the locale data for all ilib packages, it will write
out one file per locale into the `./locale` directory. You can change the names
of these directories to best fit your project, and/or scan additional source
directories.

Here's what your app's directory tree may look like after `ilib-assemble` is
finished running:

```
.
├── locale
│   ├── en-US.js
│   ├── de-DE.js
│   ├── ja-JP.js
│   ├── zh-Hans-CN.js
│   └── root.js
├── node_modules
│   ├── ilib-localeinfo
│   │   ├── assemble.mjs
│   │   ├── locale
│   │   ├── package.json
│   │   └── src
│   │       └── index.js
[etc]
├── package.json
├── webpack.config.js
```

You can see that the `locale` directory in the root of your app now contains a
single file for each locale plus an extra file named `root.js`. The `root.js`
file contains the default locale settings for
the whole world and can be used as fallback locale data if a locale is requested
that was not explicitly included in your webpack bundle.

Configuring Webpack
-------------------

Here is how to change your Webpack configuration to include ilib locale data.

First, you should make sure to include all of
the ilib modules into your app's package. Fortunately, all of the ilib modules have names
that start with the prefix "ilib-" so they are easy to recognize. Example:

```javascript
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: /node_modules\/ilib-/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
```

It is important to include the ilib classes as above in order for Webpack to find
and use the ES6 version of the `Loader` class, which is implemented in the `ilib-loader`
package. This
package is the one that knows how to load locale data files per platform. The loader
for Webpack will automatically include the locale data files generated by the
`ilib-assemble` in the previous section when you add an alias called "calling-module"
to your webpack configuration. The value of this alias should be the relative path to
the locale data files that were generated by `ilib-assemble`. If you followed the
example above, the files would be under the `./locale` directory in root of your app:

```javascript
    resolve: {
        alias: {
            "calling-module": "./locale"
        }
    }
```

Webpack will read and chase down all dependencies and include them in the bundle,
including all of the subclasses of the `Loader` class in the `ilib-loader` package
which is the class that knows how to load files. Most of the subclasses
are intended for other platforms, and you only really need the `WebpackLoader`
class. The other subclasses do not need to be included in your app's webpack bundle
but they are imported by that package. How can we leave them out of your webpack
bundle?

The way you can avoid including these useless subclasses is to declare that they
are external. That is, Webpack will assume that the environment that your app is
running in will provide these dependencies already so it doesn't need to include them.
In our case, we won't actually provide those dependencies, because we don't need
to -- the code that uses those dependencies will never run under webpack and therefore
will never cause any exceptions. Yes, that leaves some unsatisfied references to
classes, but they will never cause a problem.

Add the following to your webpack.config.js file to declare them as external:

```js
module.exports = {
    "externals": {
        "./NodeLoader": "NodeLoader",
        "./QtLoader": "QtLoader",
        "./RhinoLoader": "RhinoLoader",
        "./NashornLoader": "NashornLoader",
        "./RingoLoader": "RingoLoader",
        "log4js": "log4js"
    }
}
```

If your app uses `log4js` for logging, you do not have to add it to the externals.
Ilib classes use a library called `@log4js-node/log4js-api`
which will look for the real `log4js` package if it is available and use it it for
logging. If it does not find it, it will use a dummy implementation of the `log4js`
API which does nothing with the logging messages. If it does find the real `log4js`,
then it will be in your Webpack bundle already, so you don't have to pretend it
is external.

Use the name "ilib-localeinfo" to configure a `log4js` appender in your app to
see logging output from this package.

Full JS Docs
============

To see a full explanation of the LocaleData class, please see
the [full API documentation](./docs/iliblocaleinfo.md).

## License

Copyright © 2022, JEDLSoft

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

### v1.1.0

* Updated to CLDR v44.0.0

### v1.0.5

* Fixed Taiwan info when the locale spec is "zh-TW" instead of "zh-Hant-TW".
  Was returning the wrong info previously.

### v1.0.4

* use a babel plugin to remove import.meta from the transpiled code for
  node < v10. Previously, this prevented this package from running properly
  on node v10

### v1.0.3

* converted a static initializer into just regular const value that is
  not exported. That way, this module can run on node < v16.11.0 properly.

### v1.0.2

* Did not export the assemble.mjs file so it was not possible to assemble
  the locale data
* Remove the incorrect check for synchronous loading of data that is already
  in the cache. The check is now in ilib-localedata instead.
* Updated dependencies

### v1.0.1

* This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

### v1.0.0

- Initial version

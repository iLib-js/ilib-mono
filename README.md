# ilib-localedata

A class that knows how to load and cache ilib locale data.

The LocaleData class relies on ilib-loader to be able to
load files from where-ever they are stored. This may take the
form of actual files in json form, or other methods, such as
webpacked lazy-load modules. The locale data class does not
need to know the details!

The LocaleData class converts a package name, a locale, and
a basename into the appropriate set of files name to attempt
to load the requested data.

Full JS Docs
--------------------

To see a full explanation of the LocaleData class, please see
the [full API documentation](./docs/ilib-localedata.md).

Logging
--------------------

Use the name "ilib-localedata" to configure a log4js appender in your app to
see logging output from this library.

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

### v1.5.0

- added the `crossRoots` option to LocaleData.loadData which will
  load all of the data in all of the roots (global and local) and
  merge it all. Normal operation, which is still default, is to use
  the first data found, no matter which root it is in, and ignore
  the data in the other roots.

### v1.4.1

- fixed a bug where getLocaleData was returning the same instance for
  all paths

### v1.4.0

- fixed a bug in data caching when the cache is cleared
- fixed a problem where sync loading is requested but the loader doesn't
  support sync loading. In this case, if the data is not in the cache, it
  now throws an exception. If the data is in the cache, it now returns it
  properly.
- in async mode only, add the ability to load the assembled locale data
  files automatically before any individual files in order to save time.
  If there is an assembled locale data file, it loads one file and then
  returns the data, instead of loading many files and merging the results
  before returning the data.

### v1.3.3
### v1.3.2

- This module is now a hybrid ESM/CommonJS package that works under node
  or webpack
- accidentally bumped the version to v1.3.3 before publishing the changes for
  v1.3.2

### v1.3.1

- fixed a bug where data loaded from webpacked js files was not cached properly

### v1.3.0

- added support for loading files within webpack in a web page
- implemented LocaleData.ensureLocale()
- now depends on updated dependencies like ilib-loader which it now loads as es6 code
    - allows webpack to see the webpack magic comments so that it knows how to bundle the locale data files
- all unit tests now work on node and on browsers with the webpack loader, including the ensureLocale() tests
- can now load data from json files as well as js files

### v1.2.0

- added support for the `mostSpecific` and `returnOne` flags to `loadData`.
  When `mostSpecific` is true, only the most specific locale data is returned.
  When `returnOne` is true, only the least specific locale data is returned.
  When these are false, the locale data is merged with all of the parent locales
  to create superset data.

### v1.1.0

- Add caching support so that data is only loaded once
- Cache the data in the global scope so that it can be shared with
all instances of LocaleData
- update documentation

### v1.0.0

- Initial version

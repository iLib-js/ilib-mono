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
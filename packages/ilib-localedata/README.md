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

Copyright © 2022, 2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-localedata/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-localedata/CHANGELOG.md).


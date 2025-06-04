# Modules Sample

A sample to demonstrate how to call and use the new modules-based ilib classes.

This particular sample uses the basic ilib-localeinfo class to load locale-sensitive
information for a requested locale.

# Usage

To run the sample, simply call

```
npm run test <locale>
```

Where you can fill in any locale spec you like for `<locale>`.

This will run the module src/index.mjs on node, which will load ilib-localeinfo
as a module. This code uses a `LocaleInfo` instance to look up the
info for the requested locale and then outputs a json representation of
that info.

To run this code in a web browser, call this instead:

```
npm run test:web
```

This will call webpack to assemble our module, ilib-localeinfo, and all of the
locale data for 3 example locales together into a webpack module, which it
then runs in chrome and firefox. The operation is similar to the node-based
command-line test, but
uses a few hard-coded example locales instead. The reason is that we have to
assemble the data for those locales into the webpack package in order for
`LocaleInfo` instance to find it, and because it is difficult to get a
locale spec from the command-line into the browser. If you would like to
see a different list of locales, call up the file `locales.json` in
your editor and edit the list of locales.

# Locale Data

How does the locale data get into a webpack bundle? If you look at ilib
classes, there are 10s of megabytes worth of locale data. We don't need
most of it, and we definitely don't want to put it all into our web pages!

The answer is that we use a tool called ilib-assemble to figure out which
subset of the data to add to the
bundle. This tool assembles that subset of data, writes it out files, and
webpack automatically includes those files into the package. If you do it right,
that locale data is lazy loaded so you only get the data for the
locale that you are currently using, not the data for all the locales
which that webpack package supports!

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

### v1.0.0

- Initial version

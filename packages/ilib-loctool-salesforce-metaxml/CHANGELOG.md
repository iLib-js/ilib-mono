## 1.1.3

-   update dependencies
-   convert all unit tests from nodeunit to jest

## 1.1.2

-   update dependencies

## 1.1.1

-   fixed a bug where the xml schemas are not loaded properly on some versions
    of nodejs
-   fixed a bug where source strings from various meta xml files cannot be added
    to a translation source file for the locale en-US

## 1.1.0

-   now uses ilib-loctool-xml plugin to parse various meta xml files to look for
    source strings. These types are parsed automatically and their schema is
    built-in to this plugin already.
-   added the ability to specify a resource file for output of the translations
-   added the ability to do mappings to read other types of meta xml that
    are not the standard ones listed above
-   updated dependencies

## 1.0.5

-   Fix a bug where the pseudo locales were not initialized properly.
    This fix gets the right set of locales from the project settings to
    see if any of them are pseudo locales.

## 1.0.4

-   Apparently in Salesforce Portuguese has no default. This fix makes sure that
    both pt-PT and pt-BR are fully specified with neither of them being the default
    for "pt" by itself

## 1.0.3

-   Fixed a problem with nb-NO and es-419 which Salesforce do not support
    -   mapped to "no" and "es-MX" respectively

## 1.0.2

-   add the sflocales.json config file to the package

## 1.0.1

-   Fixed a problem in the package.json where it was pointing to the wrong main file name
-   Fixed a problem where it was not handling the resource types properly
    -   previously, it used the "flavor" concept to differentiate between types,
        but a flavor is associated with a whole file, not individual strings
    -   now uses a "context" which is associated with individual strings

## 1.0.0

-   Initial version
-   Added support for classes, fields, and objects
-   writes out translation meta xml files

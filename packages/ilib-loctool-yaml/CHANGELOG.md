# ilib-loctool-yaml

## 1.5.1

-   update dependencies
-   make it work on node 10 & 12
-   convert unit tests from nodeunit to jest

## 1.5.0

-   added checkTranslatability setting to turn on or off the ability
    to guess whether values are translatable. Default is true, same
    as before, but now you can turn that off and allow all
    values to be translated.

## 1.4.1

-   update dependencies

## 1.4.0

-   Add a hash of the file name into the key for each resource so that
    resource "a" from file1 does not conflict with resource "a" in file2.
-   Minimum version of node that this can run on is now v10

## 1.3.0

-   Add support for mappings in yaml config that allows custom output
    file naming and use of schema per-mapping
-   Add `commentPrefix` key to the schema that allows to specify prefix
    for context comments that are extracted along with source strings

## 1.2.0

-   Add support of yaml comments that enables providing context
    comments for translators

## 1.1.1

-   Fix a bug where the pseudo locales were not initialized properly.
    This fix gets the right set of locales from the project settings to
    see if any of them are pseudo locales.

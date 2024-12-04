# ilib-lint-python-gnu

## 2.0.1

-   Fixed a bug where the exports were not properly set up in the package.json

## 2.0.0

-   Updated dependency from i18nlint-common to ilib-lint-common
    -   IntermediateRepresentation now takes a SourceFile as an
        parameter to the constructor instead of a file path
    -   can now be loaded by ilib-lint >= v2

## 1.2.0

-   updated dependencies, including updating to i18nlint-common 2.x
-   parser now returns an array of IntermediateRepresentation objects

## 1.1.0

-   updated dependencies
-   added getType() method to the POParser plugin
-   now return the results of parsing from the POParser.parse() method

## 1.0.0

-   initial version
-   PO parser for gnu .po and .pot files
-   Python rules for gnu gettext resources

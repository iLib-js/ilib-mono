## 1.2.3

-   update dependencies
-   convert unit tests from nodeunit to jest

## 1.2.2

-   update dependencies
-   use the loctool's logger instead of its own

## 1.2.1

-   Fix a bug where the pseudo locales were not initialized properly.
    This fix gets the right set of locales from the project settings to
    see if any of them are pseudo locales.

## 1.2.0

-   Added the ability to set the target locale for the file from the
    project settings if it is there. Otherwise, fall back to parsing
    the path name to find the locale.
-   Fixed the way that flavors are detected in the path name

## 1.12.0

-   Added support for the dnt flag (do not translate) in Resources
    -   also for the "translate" flag of translation units

## 1.11.0

-   added location information to the TranslationUnit and Resource constructors
    plus a Location class to keep track of the location in the source file
    where the resources come from.

## 1.10.0

-   now ships with commonjs code as well as modern ESM in the same package
-   updated dependencies

## 1.9.1

-   forgot to export the HTML data in the previous version from the main entry point

## 1.9.0

-   added data about HTML in the Utils
    -   nonBreakingTags - a hash of all HTML tags that do not break a string
    -   selfClosingTags - a hash of all HTML tags that are commonly self-closing
    -   ignoreTags - a hash of HTML tags where the content is ignored, such as <script>
    -   localizableAttributes - a hash of all tags that contain attributes which
        have localizable values

## 1.8.1

-   update dependencies
-   fixed a bug where the ResourceXliff.getVersion() call was documented to
    return a string, but it came out as a floating point number instead. Made
    it return the string properly.
-   converted all unit tests to jest

## 1.8.0

-   added parsePath() utility function which takes a template and a path
    and returns an object that maps each template parameter to a part of
    that path
    -   getLocaleFromPath() is now re-implemented to use this
        function to find the locale parts of a path

## 1.7.0

-   added getLines() method to tell how many lines there are in the xml file
-   added support for location information of the start of each resource
    in the original file where the resource instances were read from
    -   supports line and character within the line

## 1.6.0

-   Added isDirty() method to the Resource class so we can see whether or
    not the resource has been modified since it was first created
    -   also added clearDirty() method

## 1.5.0

-   Added getVariant method to the TranslationUnit class

## 1.4.0

-   Added TranslationUnit and TranslationVariant classes
-   added hashKey function to the utilities
-   fixed missing import for makeDirs() utility function

## 1.3.0

-   Added more utility functions:
    -   isEmpty - return whether or not an object is empty
    -   cleanString - removing differences that are inconsequential for translation such as leading whitespace
    -   makeDirs - create directories on disk
    -   containsActualText - test if there is text left over after HTML and entities are stripped
    -   objectMap - visitor pattern for objects

## 1.2.0

-   Added formatPath and getLocaleFromPath utility function

## 1.1.0

-   Added ResourceXliff class (represents an xliff file as a list of Resource instances)
-   Added TranslationSet class (sets of Resources)
-   Introduced some backwards compatibility support so that this library
    can be used with loctool plugins.
    -   added some deprecated methods and accept some deprecated
        constructor parameters

## 1.0.0

-   Initial code copied from loctool 2.18.0:
    -   Resource
    -   ResourceString
    -   ResourceArray
    -   ResourcePlural

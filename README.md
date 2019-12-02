# ilib-loctool-ghfm

Ilib loctool plugin to parse and localize github-flavored markdown

## Release Notes

### 1.2.5

- Handle valueless HTML attributes properly

### 1.2.4

- The previous fix where HTML comments were not recognized and skipped properly 
was only fixed for the parsing side of this plugin. Now it is fixed for the
localization side as well.

### 1.2.3

- Fixed a bug where HTML comments were not recognized and skipped properly 
if there was whitespace/indentation before them in the source file.

### 1.2.2

- Fixed reference link support. If there is text in a reference link, then it will
be included in the text to localize.


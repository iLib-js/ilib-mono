# ilib-loctool-ghfm

Ilib loctool plugin to parse and localize github-flavored markdown

## Release Notes

### 1.3.0

- The plugin now adds a translator comment/note for inline code so that the
  translator can know what the text of the self-closing components is.

### 1.2.6

- Add support for shortcut and full link references
    - Shortcut references are converted back to full so that the title of the
      reference can be translated to something different than the [possibly]
      English label of the shortcut.

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


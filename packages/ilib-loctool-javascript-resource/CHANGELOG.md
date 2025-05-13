# ilib-loctool-javascript-resource

## 1.1.0

### Minor Changes

- a377dd2: - Add the ability to specify a header and footer in
  the output js file:

  - Use the same replacements as in output paths
    (See loctool utils.formatPath() for details.)

  ```json
  {
    "settings": {
      "javascript": {
        "header": "const strings_[language] = ",
        "footer": "export default strings_[language];\n"
      }
    }
  }
  ```

## 1.0.7

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.0.5

- update dependencies

## 1.0.4

- Add the ability to specify the locale to the JavaScriptResourceFileType.newFile() method
- Add the ability to specify the path name of the caller has already calculated what it
  should be. This is so that the caller can implement output mappings and specify the
  output file name for the resource file
- Updated dependencies
- Min version of node is 10 now

## 1.0.3

- Fixed bug where the resource directory generate incorrectly.

## 1.0.1

- Fixed bug where JavscriptResourceFileType.getExtracted and getNew and getPseudo were returning
  undefined instead of an empty translation set.

## 1.0.0

- Initial release

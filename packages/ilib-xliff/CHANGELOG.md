## Release Notes

### v1.2.0
- added support for parsing inline content markup in XLIFF 1.2 (`<x />` etc.)
- added support for parsing CDATA content in XLIFF 1.2 (`<![CDATA[<foo />]]>`)

### v1.1.0

- add support for the "translate" flag on translation units
- fixed the API documentation to be more useful
- added getLines() method to count the number of lines in the original
  xml if this is being used to parse the xliff file
- added "location" information of the start of each translation unit
  in the xml file
    - gives line number and character within the line of each
      trans-unit (v1.2) or unit (v2.0) element in the file

### v1.0.0

- initial version copied from loctool 2.18.0
- converted to ESM

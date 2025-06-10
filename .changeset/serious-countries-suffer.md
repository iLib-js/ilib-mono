---
"loctool": minor
---

* Add the `XliffFactory` to support various XLIFF formats.  
 It operates to create an instance of either the `Xliff` or the new `webOSXliff` class that meets the needs of the webOS platform based on the use case. If support for parsing another format is needed, it can be added in a similar manner.
* Some updates for the loctool options:
  * Add the new loctool option `--metadata`.  
This can accept any value in the form of `aaa=bbb` and can be used as needed. Currently, this data is used in webOSXliff. i.e `--metadata device=Monitor`
  * Remove the `custom` option that was used in `--xliffStyle`. Instead, the options `webOS` will be used.  
  Previously, the content of the custom option was already being parsed in the form of xliff for the webOS.
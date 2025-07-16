---
"loctool": minor
---

* Add the `XliffFactory` to support various XLIFF formats.  
 It creates an instance of either the `Xliff` class or the new `webOSXliff` class, depending on whether it’s targeting the webOS platform or another use case. Additional format support can be added in the same way if required.
* Update loctool options:
  * Add the new `--metadata` option.
  It accepts key-value pairs in the form `aaa=bbb` (e.g. --metadata device=Monitor), and is currently used by webOSXliff.
  * Removed the `custom` option from --xliffStyle. Instead, the option `webOS` will be used.
  Previously, the content of the `custom` option was already parsed as xliff for webOS.
---
"ilib-loctool-javascript-resource": minor
"ilib-loctool-javascript": minor
"ilib-loctool-regex": minor
---

- Support new outputSourceLocale flag in the settings
  - Meant to support languages/i18n libraries where
    strings are extracted from the source code directly
    and there is no source locale resource file
  - For the javascript and regex plugins, this causes
    the plugin to write out the source locale along
    with the other locales if it is configured in the
    the locales list
  - For the javascript resources plugin, it means that
    it will write out the source string instead of the
    target string for source locale Resource instances

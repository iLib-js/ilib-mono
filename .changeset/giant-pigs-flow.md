---
"ilib-tools-common": minor
---

- Added support for Scala and C++ string escaping and unescaping
  - All Scala string types:
    - scala - Regular single or double-quoted strings ("...")
    - scala-raw - Raw strings like (raw"foo")
    - scala-triple - Triple-quoted strings like ("""foo""")
    - scala-char - Character literals like ('a')
  - All C++ string types:
    - cpp - Regular double-quoted strings ("...")
    - cpp-char - Character literals ('...')
    - cpp-raw - Raw strings (R"(...)") - no escape processing
    - cpp-wide - Wide strings (L"...")
    - cpp-utf8 - UTF-8 strings (u8"...")
    - cpp-utf16 - UTF-16 strings (u"...")
    - cpp-utf32 - UTF-32 strings (U"...")

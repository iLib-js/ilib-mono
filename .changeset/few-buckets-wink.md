---
"ilib-loctool-mdx": patch
---

Fix handling of non-translatable HTML tags inlined in translatable text. HTML tags that should not be translated (like `<code>`) inlined in translatable text were being extracted as translation units. Additionally, segmentation of text flows with these tags was inconsistent between extraction and localization, effectively making it impossible to localize. Now, these tags are treated as non-breaking elements (`<c0/>`).

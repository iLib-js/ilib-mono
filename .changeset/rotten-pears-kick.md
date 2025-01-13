---
"loctool": patch
---

Now uses ICU<->Plural conversion code from the ilib-tools-common library instead of its
own implementation. This way, the code can be shared between tools.

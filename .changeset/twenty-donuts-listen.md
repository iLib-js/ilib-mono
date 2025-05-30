---
"ilib-lint": minor
---
Added auto-fix functionality for the resource-no-fullwidth-digits rule. The fixer automatically converts fullwidth digits (１２３４５) to their ASCII equivalents (12345) in resource strings.

Added auto-fix functionality for the resource-no-fullwidth-latin rule. The fixer automatically converts fullwidth Latin characters (ＡＢＣ) to their ASCII equivalents (ABC) in resource strings.

Added auto-fix functionality for the resource-camel-case rule. The fixer automatically converts target strings to match source strings that contain only camel case (e.g., "myVariable", "someFunction").

Added auto-fix functionality for the resource-snake-case rule. The fixer automatically converts target strings to match source strings that contain only snake case (e.g., "my_variable", "some_function"). 

Added the kebab case match rule with auto-fix functionality. If source strings contain only kebab case and no whitespace (e.g., "my-variable", "some-function"), then the targets must be the same. It is treated as Do Not Translate. If the target is different from the source, it is an error. The fixer automatically converts target strings to match source strings.
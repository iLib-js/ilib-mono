---
"ilib-lint": minor
---

- Add ResourceGNUPrintfMatch rule for GNU printf parameter validation
  - Implement new linting rule that validates GNU printf-style parameters between source and target strings
  - Support full GNU printf syntax including positional parameters (%1$s, %2$d), width/precision from arguments, and GNU extensions
  - Handle ResourceString, ResourceArray, and ResourcePlural resources with proper category matching
  - Register rule in new "gnu" ruleset for programming-language-agnostic GNU printf validation

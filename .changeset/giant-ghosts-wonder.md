---
"ilib-lint": patch
---

- Various result and formatter fixes to give better formatted output
  - make sure all rules are setting the locale field of a Result properly
  - make sure all rules are setting the lineNumber field of a Result properly
  - make sure all rules are getting the pathName from the intermediate representation instead
    of the resource. The intermediate representation contains the name of the xliff file that
    the resource was read from, whereas the resource instance contains
    the path to the original source file where the string was extracted
  - does not divide by zero any more causing incomplete stats table at
    the end of the formatted result output

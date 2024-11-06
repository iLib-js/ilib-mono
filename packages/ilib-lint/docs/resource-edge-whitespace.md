# resource-edge-whitespace

If You received this error, ensure that the target string edges' whitespace exactly matches those of source string - both in front and in the end.

A string extracted for translation from source code can sometimes have whitespaces on its edges, which are significant for formatting in the UI (e.g. in alignment, concatenation etc.). This rule ensures that sequence of whitespaces at either edge of source and target match each other exactly.

Examples:
| Source | Target (incorrect) | Target (correct) | Comment |
| --- | --- | --- | --- |
| `"Today is the "` | `"Heute ist der"` | `"Heute ist der "` | Missing whitespace on the trailing edge - beginning of a concatenated sentence |
| `" day of the week."` | `"Tag der Woche."` | `" Tag der Woche."` | Missing whitespace on the leading edge - end of a concatenated sentence |
| `" fox jumps over the "` | `"Fuchs springt über den"` | `" Fuchs springt über den "` | Missing whitespaces on both edges - middle of a concatenated sentence |
| `"An example text."` | `"Ein Beispieltext. "` | `"Ein Beispieltext."` | Extra whitespace at the end - added accidentally during translation |

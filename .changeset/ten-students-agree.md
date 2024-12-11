---
"loctool": minor
---

- Added the ability to read and write intermediate files in po format
    - Added a new command-line parameter "--intermediateFormat" to choose
      between xliff (default) and po
    - The output intermediate files are the <project>-extracted.<ext> and 
      <project>-new-<locale>.<ext> files.
    - Can represent all of string, plural, or array resources
    - Can also read po or xliff files as the source of translations
      in the xliffs dir. (Unfortunately, the parameter is still called
      xliffsDir even though it may now contain po files with translations.)

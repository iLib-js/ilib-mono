---
"loctool": patch
---

- Fixed a problem where the project that convert needs to
  instantiate in order to run tried to find and load every
  single xliff file in the current directory recursively as
  translations file in the xliffDir. The problem comes in
  if there are many xliff files in the current directory
  or there are many directories underneath the current
  working directory. That caused start-up to take a really
  long time.
  - The fix is to for the convert action to turn off
    loading translation files when instantiating a project.
    They are not needed anyways.

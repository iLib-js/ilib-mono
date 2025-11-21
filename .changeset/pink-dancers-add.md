---
"message-accumulator": major
---

- Make the pop() method throw if there is nothing to pop
  - before this change, it would ignore the pop if it was already
    at the root and there was nothing to pop. It would print a cryptic
    message on the console about unbalanced tags with no information
    about where the error was and then return undefined as if nothing
    was wrong.
  - by pushing the error handling up to the caller, now we are able
    to do something reasonable with it like print an error message
    with details about which file and line the error was
- This is a breaking change, so this warrants a full major release
  All callers have to change their code to catch the exception in order
  to use this new version

---
"ilib-po": minor
---

- Added the ability to ilib-po to encode ResourceArray resources. The array elements
  are encoded as separate resources with the key of the array resource
  and the index of the array element both encoded in new types of comments
  in the po file. These are po file format extensions which are mostly
  ignored by other po file tools, but are used by the ilib-po parser and
  generator to encode the array elements in a reversible way.
- The above work with ResourceArray resources now also allow you to add
  a key to each resource that is different than source string. This goes
  for all resource types, not just arrays.
- Fixed a bug where resources that have comments in them which are not
  in json format were parsed as if they were json. Now the parser will
  only treat comments as json if they start with a '{' character.

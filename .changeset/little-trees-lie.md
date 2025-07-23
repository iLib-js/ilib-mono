---
"ilib-tools-common": minor
---

- Add a `metadata` property to the `Resource` class to store any metadata that may exist on a per-Resource basis. It is up to parsers to recognize and parse the metadata appropriately and up to the serializers to serialize it properly again.

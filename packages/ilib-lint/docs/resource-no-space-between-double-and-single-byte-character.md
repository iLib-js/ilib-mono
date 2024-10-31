# resource-no-space-between-double-and-single-byte-character

Ensure that translations do not contain a space character between a double-byte and single-byte character.
Punctuation characters are not included, so a space may appear between the double-byte character and
the single-byte punctuation.

Examples:

Good: "Box埋め込みウィジェット"<br>
Bad: "Box 埋め込みウィジェット"

Good: "EXIFおよびXMPメタデータ"<br>
Bad: "EXIF および XMP メタデータ"<br>
Bad: "EXIFおよび XMPメタデータ"

Good: "[EXIF] および [XMP] メタデータ" (Okay to have space between double-byte character and single-byte punctuation)

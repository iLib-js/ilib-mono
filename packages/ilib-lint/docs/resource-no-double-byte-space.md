# resource-no-double-byte-space

Ensure that translations do not contain double-byte space characters. These should be represented as ASCII spaces instead.

See https://en.wikipedia.org/wiki/Whitespace_character for details on various whitespace characters.

Examples:

Good translation: "本当? はい! 100%"<br>
Bad translation: "本当?　はい!　100%"
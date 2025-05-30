# resource-csharp-numbered-params

Ensure that named C# parameters that appear in the source string are
also used in the translated string. Numbered parameters have the syntax {0}
and may optionally have some formatting instructions, such as {0:D} for a
decimal number. The same
parameter must also exist in the target string containing the same numbered
parameter along with the optional formatting instructions.
Sometimes translators forget to include the parameter in
the target string, and this rule helps to catch those cases.
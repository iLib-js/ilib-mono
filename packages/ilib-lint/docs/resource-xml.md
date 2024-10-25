# resource-xml

If the source string contains XML-like tags, then the translation must contain
the same tags. The tags themselves may be reordered or nested differently than
in the source, but:

- they should include the same number of tags
- the tags should have the same name as ones in the source
- the XML must be well-formed. That is, tags are nested properly and every
open tag has a corresponding closing tag
- unnamed tags such as `<>` and `</>` are not allowed

Self closing tags such as `<p/>` are allowed.

Example of correctly matched tags in a German translation:

- source: `You must <b>wait</b> for the <a href="url">job</a>.`
- target: `Sie müssen auf den <a href="url">Job</a> <b>warten</b>.`

Example of incorrectly matched tags in a German translation:

- source: `You must <b>wait</b> for the <a href="url">job</a>.`
- target: `Sie <b>müssen</c> auf den <a href="url">Job</a> <c>warten</c>.`

Problems in the above translation:

1. The `<b>` tag has a closing `</c>` tag making it is not well-formed
2. The number of tags is different than the source
3. The names of tags are different than the source

## Exceptions for HTML Tags

HTML4 tags that are commonly written without a closing tag are allowed.
The code first checks if the tags are well-formed already. If not, then it
treats these HTML tags as if they were a self-closing tag without having
the trailing slash inside the angle brackets.

Example: `<p>` (start paragraph) is treated as it is were `<p/>`

Here is the list of HTML4 tags that are treated as if they were self-closing
if they are not well-formed:

- `<area>`
- `<base>`
- `<bdi>`
- `<bdo>`
- `<br>`
- `<embed>`
- `<hr>`
- `<img>`
- `<input>`
- `<li>`
- `<link>`
- `<option>`
- `<p>`
- `<param>`
- `<source>`
- `<track>`

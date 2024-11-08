# message-accumulator

A package to help transform localizable messages in a variety of
syntaxes into a form that
translators can easily translate without knowing anything about
that syntax, and after translation, back again into a form that
programs can easily use to recompose localized messages in the
original syntax.

In HTML or JSX, for example, whole translatable messages are hard to identify.
In HTML, some tags are commonly found inside of whole
sentences, and some are not. What forms a whole translatable
message?

Consider this snippet:

```
<div>
	<span class="body">
	    There are <a href="http://url" title="localizable title">50 files</a> in the <span class="copyright">Simple Markdown</span> system.
	</span>
</div>
```

In this case, the outer "div" and "span" tags are not part of any localizable
snippet of text. The entire string "There are
&lt;a href="http://url" title="localizable title"&gt;50
files&lt;/a&gt; in the &lt;span class="copyright"&gt;Simple Markdown&lt;/span&gt; system."
should be localized as a single sentence because it would not
make any sense to localize the parts "There are ",
"50 files", " in the ", "Simple Markdown", and " system." separately.
They are not simply phrases that you can
translate out-of-context, and then re-concatenate and have
any hope that it will make logical sense in many other languages. Human
language is more complicated than that! In order for translators to do
a good job, they need the entire sentence.

The only problem is that translators
are not so good with programming language syntax and tend to do things
like occasionally translating HTML tag names or attribute values. For example,
they may see a series of CSS class names that forms a short phrase in English,
and decide that they should be translated. The situation is even worse in
JSX because the names of tags are not a fixed list like HTML.
Components can have any name
and even translators who are familiar with HTML tags are confused as to
what is translatable and what is not. In our example above, we even have
another added complication
that the value of the "title" attribute of the "a" tag is actual
localizable text but the value of the other attributes are not, which
is even more confusing to the translators. Again, they are not programmers.

But that is okay. They are amazing linguists, and this library helps to hide
these complications from them. This library hides the contents of such tags
from the translators and lets them translate with minimal syntax
getting in the way. The sentence above would be easier for translators
to translate if it were something like this:

```
There are <c0>50 files</c0> in the <c1>Simple Markdown</c1> system.

where:

c0 = <a href="http://url" title="localizable title">
c1 = <span class="copyright">
```

Translators can learn this simple XML syntax quickly, and don't need to know the
intracacies of any programming or markup language. They
can focus on the linguistic part of the translation
and only have to make sure that the corresponding portion of translation
is surrounded by the XML-tags "c0" and "c1". (The "c" stands for
the word "component" -- XML tags have to start with a letter.)

Translating this type of message has many advantages:

* The contents of the tags is hidden from the
  translators, so they cannot mess it up by translating things that should
  not be translated and by leaving out brackets or quotation characters.
* It prevents code injection attacks. A nefarious person working at the translation
  agency would not be able to insert some malicious javascript code in the
  middle of a translation hidden inside of some HTML tags because source string
  does not contain HTML.
* The contents of the tags can change frequently without affecting the
  content of the source string, and therefore the translation. A designer
  can add a new CSS class if they desire, and the programmer can change
  the href attribute of a link tag without causing a
  retranslation of the string. The new CSS class and url will be
  recomposed into the translated string later.

Now in many human languages, grammar is different than in English, so it is
entirely possible that the order of the components turns out different for
a translated string than in English. Also,
the nesting of those components may change. We need to allow the translators
the freedom to do what is right for the grammar of their target language.
That means we need to be able to decompose a translated string back
into a tree of syntax nodes that can easily be transformed back into
the source programming language again, whether that is HTML, JSX, or
even Markdown. This is accomplished by reapplying the mapping between
the components and the original tag text to the appropriate parts
of the translation.

Consider this translation of our example above into German:

```
In den <c1>Simple Markdown</c1> System, gibt es <c0>50 Dateien</c1>.
```

Note that the order of the components is indeed reversed from English -- c1
comes before c0. Ideally, we would like to decompose this into this tree:

```
root
  "In den "
  c1
    "Simple Markdown"
  "System, gibt es"
  c0
    "50 Dateien"
  "."
```

From there you can easily reapply the mapping `c1 = <span class="copyright">`
and `c0 = <a href="http://url" title="localizable title">`, plus the appropriate
close tags of course, to reconstruct the HTML into nicely translated HTML:

```
In den <span class="copyright">Simple Markdown</span> System, gibt es <a href="http://url" title="localizable title">50 Dateien</a >.
```

In many cases, the caller of
this message accumulator class will have an abstract syntax tree (AST) in memory
which is the result of parsing the original English source file with a
standard parser. In this case,
"c0" and "c1" would map to particular nodes in that tree instead of to snippets
of text containing the HTML tags.
The caller's AST can be modified for the translation by reusing existing AST nodes
in the place of the components.

The goal of the message-accumulator class is to help the caller accumulate
a localizable unit (a "message") while traversing the AST of the source file,
as well as to be able to decompose a translated string back into a tree
that can be easily transformed into AST nodes again.

Usage
-----

### Extracting source strings from your source file

The MessageAccumulator class has four main methods to accumulate a string:

- addText() - Add new text to the current context of the string
- push() - Start a new context, such as text within an HTML tag
- pop() - End the current context and return to the previous one
- getString() - Retrieve the translatable string in this accumulator, where
  the contexts are hidden with the "c" XML tags

Step 1. Use your parser to generate an abstract syntax tree (AST) that represents
the file.

Step 2. Walk the AST, accumulating text as appropriate using addText and pushing
contexts for any nodes that do not mark a break in the text. For example, if
your HTML parser has some text followed by the "b" tag, then that "b" tag should
not cause a break in the text. The code should push a new context and continue
to accumulate more text.

Step 3. At some point, the parser will eventually come to a node
in the AST that marks a break in the translatable message. (Or it will come
to the end of the file!) For example in HTML, you might encounter a &lt;div&gt;
tag. When this happens, the current value of the message accumulator is the
translatable string. The code can retrieve the string using the getString
method, and this string can be sent into the localization process. Typical
the code will then create a new MessageAccumulator instance for the next
piece of text.

### Localizing your source file

At some point, the translations of all the strings will be done, and the
localized file can be reconstructed.

To do this, the code starts with the source file and the set of translations
from your localization system, in the form of resource files or a translation
server.

Step 1. The source file is reparsed and re-walked as above, but this time, you keep
track of nodes in the AST by pushing them into your contexts. This decorates
the nodes in the accumulator with the AST nodes. Doing this creates
a mapping between contexts and the AST nodes that they represent. The push()
method takes a parameter that is your AST node.

Step 2. As the code walks the nodes and hit some node that causes the end of
the translatable text, it can then apply the translation. The result of
getString() gives the translatable source, and the translation of that is
looked up in the translation system. Then, the code will create a new MessageAccumulator
from that translated string plus the current MessageAccumulator containing
the source string. This will apply the mapping from context to AST node
appropriately to the translated MessageAccumulator.

Step 3. Walk the new translated MessageAccumulator again, converting the
MessageAccumulator nodes into AST nodes. Then, replace the AST nodes with
these new ones.

Step 4. When all of the text is translated, convert the AST back into text
again to reconstruct your translated file.

## License

Copyright © 2018-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

# Release Notes

## v3.0.0

- convert all unit tests from nodeunit to jest
- export the es6 code as real es6 modules and old transpiled javascript
  for older packages to use (breaking change)

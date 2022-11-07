# ilib-resbundle

Load bundles of translated strings.

## Installation

```
npm install ilib-resbundle

or

yarn add ilib-resbundle
```

## Quick Start

In `myapp/src/example.js` file:

```javascript
import ResBundle from 'ilib-resbundle';

[...]
    const rb = new ResBundle({
        name: "strings",
        locale: appLocale
    });

    const buttonLabel = rb.getString("Send now");

    const dialogBodyStr = rb.getString("one#There is {count} invitation|#There are {count} notifications");
    const dialogBody = dialogBodyStr.formatChoice(count);
```

If your app's locale was, let's say, German, then in `myapp/locale/de/strings.json` file:

```
{
    "Send now": "Jetzt schicken",
    ""one#There is {count} invitation|#There are {count} invitations": "one#Es gibt {count} Einladung|#Es gibt {count} Einladungen"
}
```

In your `myapp/package.json` file (only the relevant parts are shown):

```
{
    "dependencies": {
        "loctool": "^2.18.0"
    },
    "scripts": {
        "localize": "loctool"     <- most of the settings come from the project.json (see below)
    }
}
```

In your `myapp/project.json` file, which configures the loctool (only the relevant parts are shown):

```
{
    "name": "myapp",
    "plugins": [ "ilib-loctool-javascript" ],
    "resourceDirs": {
        "javascript": "locale"
    },
    "resourceFileTypes": {
        "javascript":"ilib-loctool-javascript-resource"
    },
    "settings": {
    "xliffsDir": "./xliffs",
        "locales":[
            "ko-KR",
            "de-DE"
        ]
    }
}
```

## API Reference

You can see the [generated API reference docs](./docs/ilibResBundle.md)
for full details.

## Translation with ResBundle

At the core of any globalization effort is the translation of text. Many people
erroneously think that translation is all there is to globalization, and they
don’t know about the internationalization of code or the localization of other,
non­text resources. The fact that you are reading this documentation means that
you probably already know better than that! This section, however, will focus
on the translation support in iLib. Other ilib libraries implement more of the
globalization functionality that ilib supports.

Translating Javascript strings is often done with some ad­hoc methods such as
creating homebrew classes to load strings, or even creating multiple copies of
the Javascript source files, one for each language. Additionally, there are some
popular libraries that do this task for you, but mostly they exist without the
ecosystem around them. Without tools, the strings would have to be extracted by
hand, which is error-prone and tedious. iLib-resbundle allows your engineers
write their code as normal with all strings in the source language, and allow
the tools to do the tedious work.

Fortunately, ilib-resbundle is indeed part of a whole ecosystem of internationalization
tools. First and foremost is the [loctool](https://github.com/ilib-js/loctool)
which can extract strings not only from Javascript sources but also from any type
of source or resource file with the right plugins.

With the loctool, strings can be extracted from the JS or HTML source files (or
any other type!), translated, and then re­inserted into your project by writing
them with the appropriate resource file format (json) for the ResBundle class to read.
Then, using the ResBundle class, you can load the translated strings, format them,
and display them properly to the user.

The entire translation cycle using the loctool is described nicely in the
[documentation for the loctool](https://github.com/iLib-js/loctool#running-the-tool).

### Using ResBundle in Nodejs Apps

Under nodejs, the resource files written out by the loctool can read directly and
synchronously using the ResBundle class:

```javascript
import ResBundle from 'ilib-resbundle';

[...]
    const rb = new ResBundle({
        name: "strings",
        locale: appLocale
    });

    const buttonLabel = rb.getString("Send now");
```

The ResBundle options include a name option that gives the base name of the file to
load. In the example above, that is "strings.json". (The ".json" gets appeneded
automatically). The locale option specifies the locale for which to load the
translations, and can be given as a string locale specifier or as an instance of
the ilib `Locale` class.

Using the regular constructor above results in synchronous loading of the files.
Synchronous loading is only supported on certain platforms such as nodejs. If
you would like to operate in an asynchronous manner, you can do that as well,
even on nodejs:

```javascript
import ResBundle from 'ilib-resbundle';

[...]
    const promise = ResBundle.create({
        name: "strings",
        locale: appLocale
    });

    promise.then(rb => {
        const buttonLabel = rb.getString("Send now");
    });
```

As with all ilib ESM classes, there is a static `create()` method which returns a promise
to load the files. The "accept" result of the promise is the ResBundle instance. After
the resource bundle has been loaded, all of the translations are cached in the ResBundle
instance. This means you can call `rb.getString()` to get a string synchronously for
as many strings you like without needing to load any more files.

### Using ResBundle on Web Pages

If you plan to use a bundler such as Webpack, see the section below. For this section,
we will simply include all of the possible translations into a page. This works nicely
or small pages and sites that do not have many strings and do not support many locales.
If you have a large page/site, or if your app supports many locales and you want to
reduce the memory footprint or loading time of your web pages, you will want to use the
asynchronous dynamic load support of Webpack in the section below.

First, run the loctool and generate a number of translated files. In this example, we
generated translations for German, French, Spanish, and the root is English:

```
myapp/
  locale/
    strings.json     (this is the root)
    de/
      strings.json
    fr/
      strings.json
    es/
      strings.json
```

Then, in the Javscript module, you would do something like this:

```javascript
import rootTranslations from '../locale/strings.json';
import germanTranslations from '../locale/de/strings.json';
import frenchTranslations from '../locale/fr/strings.json';
import spanishTranslations from '../locale/es/strings.json';
import { LocaleData } from 'ilib-localedata';

// explicitly save the data in the cache so ResBundle can find it
LocaleData.cacheData({
    "root": {
        "strings": rootTranslations // "strings" is the base name in the constructor
    },
    "de": {
        "strings": germanTranslations
    },
    "fr": {
        "strings": frenchTranslations
    },
    "es": {
        "strings": spanishTranslations
    }
});


const rb = new ResBundle({
    name: "strings",
    locale: appLocale
});
```

Note that we can use the ResBundle class synchronously, even in a web page, because the data
is already loaded and inserted into the cache, so no files need to be loaded. The ResBundle
class uses the LocaleData class to load and cache its data.

### Using ResBundle in Webpack

To use the ResBundle class inside of a webpack bundle, you can do the same trick as in the
last section above where the translations are synchronously loaded and then explicitly cached
into the LocaleData cache. If your app has many strings or is translated to many locales, you
definitely do not want to do that because your webpack bundle will become very large and
bloated. Instead, you can take advantage of webpack's ability to dynamically load chunks
of files.

Now, ilib data is encoded in many different files, especially if you have many locales.
Each ilib library can come with its own locale data, and your own app also has locale data in
the form of translated strings. To do dynamic loading of all this locale data in webpack,
you must first use the [ilib-assemble](https://github.com/ilib-js/ilib-assemble) tool to
assemble all of it into a minimal set of files, one per locale. That way, when the locale
data is need for a particular locale, then only one file is loaded, and it comes with all
the data needed for that locale across all ilib classes. This helps to minimize the costly
http requests or file load requests at the expense of somewhat larger files.

To use `ilib-assemble`, add a script to your package.json:

```
{
    "devDependencies": {
        "ilib-assemble": "^1.0.2"
    },
    "scripts": {
        "assemble": "ilib-assemble -localefile ./locales.json --resources locale assembled src"
    }
}
```

The above works when your translated files are in a directory called `locale`, the output should
go to a directory called `assembled` and the sources for your app are located in a directory
called `src`. The option `--resources` names the directory containing your translated resource
files that need to be included into the rest of the locale data.

The `locales.json` file documents the locales that your app supports. It has a very simple format:

```
{
    "locales": [ "en-US", "fr-FR", "de-DE", "es-ES" ]
}
```

Once you run `npm run assemble`, the `assembled` directory will be created and populated
with javascript files named for the locale which contain all of the locale data for all ilib
libraries and the translations of your app for that locale. These files form a minimal set
of locale data.

```
myapp/
  assembled/
    root.js
    fr-FR.js   <- these contain ilib library locale data + your translations
    de-DE.js
    es-ES.js
```

See the [documentation of ilib-assemble](https://github.com/ilib-js/ilib-assemble) for more details
on how this works.

In order to include all of those files into your webpack bundle and to get the `LocaleData`
class to see them, you will need to change your webpack.config.js file to add a `calling-module`
alias that points at the `assembled` directory:

```
{
    externals: {
        "./NodeLoader.js": "NodeLoader",
        "./QtLoader.js": "QtLoader",
        "./RhinoLoader.js": "RhinoLoader",
        "./NashornLoader.js": "NashornLoader",
        "./RingoLoader.js": "RingoLoader",
        "log4js": "log4js",
        "nodeunit": "nodeunit"
    },
    resolve: {
        alias: {
            "calling-module": path.join(path.dirname(module.id), "assembled")
        }
    }
}
```

The way it works is that the LocaleData class will include every file it finds in the
`calling-module` directory as a separate chunk that will be loaded dynamically when
needed. (ie. the first time you create an instance of an ilib class). The
`calling-module` should point to the same one that you specify as a parameter to
the `ilib-assemble` tool in your `package.json`.

In your module, you can ensure that all of the strings have been loaded into the cache
first and then you can use all ilib classes synchronously thereafter in the rest of
your app. In `index.js`:

```javascript
import { LocaleData } from 'ilib-localedata';
import ResBundle from 'ilib-resbundle';


LocaleData.ensureLocale(theCurrentLocale).then(data => {
    const rb = new ResBundle({
        name: "strings",
        locale: theCurrentLocale
    });

    const str = rb.getString("my string");
});
```

## String Loading

The main workhorse method of the ResBundle class is `getString()`. This searches for a
translation of the given source string and returns it.

Typically, the source string is
in your source language which is often English, but that does not have to be the case.
You can use any language you like as the source language.

If the translation for the string does not exist, `getString()` will return the source
string itself. This
means that while you are developing your program or web site and the translations haven't
been done yet, you will always get a reasonable string of some sort out of this method. Your
German QA people may see the older parts of the UI translated to German and the new strings
will be in English until the translations are ready and re­integrated back into the project.

When the strings are being loaded, the ResBundle class will also look up the “locale hierarchy”
tree for fallback translations and merge them together in much the same way that Java does. For
example, let’s say you had your locale set to “fr-­CH-­govt” for the French­ speaking part of
Switzerland. The variant is for the Swiss government, as perhaps you have special translations
just for them. In this case, when you load in the resources for that locale, the resource bundle
will first load any generic strings that are shared between all versions of French. ie. the “fr”
locale. Then, it will load in all the translations for “fr­-CH” for Swiss­-French­ specific
translations. Any translation in “fr­-CH” overrides the corresponding translations in “fr” with
the same source string, and may add a few of its own. Finally, the “fr-­CH-­govt” file is loaded
and any translations it provides overrides any existing translations in "fr" or "fr-CH".

Based on this merging, it is recommended that you put most translations into the set for the
base language (ie. "fr"), and only override them with locale-­specific translations where
they are different from the general language. In this example, the "fr-CH" would contain only
the few strings that are written differently in Swiss French than in world-wide general French.

### String Formatting

Consider this code:

```
const str = rb.getString("Your packaged arrived on ") + date +
    rb.getString(" and took ") + days + rb.getString(" days to get there.");
```

In the above example, the translated strings are nicely wrapped with a `rb.getString()`
call. However, they are concatenated together with variables and a simple plus operator.
This is a big problem for translation! The reason is that in
various languages, the variables sometimes need to be at the beginning,
the middle, or the end of the string in order to be grammatically correct. When they are
concatenated as above, they translator has no ability to make the translation grammatically
correct for their language.

The solution to this problem is to do proper string formatting using the IString class.
The `getString()` method returns an instance of an ilib [IString](https://github.com/ilib-js/ilib-istring)
which has a `format()` method for this purpose.

Here is how the above code should be modified to do formatting properly:

```
const strTemplate = rb.getString("Your package arrived on {date} and took {n} days to get there.");
const str = strTemplate.format({
    date: arriveDate,
    n: arriveDays
});
```

Note that the strings now contain replacement parameters enclosed in braces, such as “{date}”
and “{n}”. These are replaced by the values of the parameters to the `format()` method, and
the resulting string is returned. Translators know not to translate replacement parameters.
Instead, they move them around in the sentence so that they are grammatically correct for their
language.

As a general rule of thumb, if you have string concatenation in your code for any user­-visible
strings, you should be using string formatting instead.

Also note that the example above is still not totally correct. The "n" replacement parameter
produces a grammatically incorrect string in English when n has the value 1. The situation is
even worse in other languages that have multiple types of plurals! To resolve that
problem, read the next section.

### Plural Support and Choice Formatting

In some cases, you need different strings based on the number of items you have. For example,
in English, you would say, “There is 1 object,” for singular and you would say, “There are 2 objects”
for plural. There is an odd convention where one item is singular, two or more items are plural,
and most bizarrely, zero items are also plural. That is, you would say, “There are 0 objects.”
The plurality of the words “is/are” and “object/objects” corresponds to the actual
number of objects you are talking about.

You might be tempted to solve this problem by writing "clever" code like this:

```
str = resBundle.getString("It took {n} day" + ((objects === 1) ? "" : "s") + " to get there.");
```

There are multiple problems with the code above:

1. That type of code assumes English grammar rules. In English, you pluralize by adding "s"
to the end of the word. In other languages, it is not always the case that can add a suffix to pluralize
a word
1. In some languages there are more than one type of plural, so the above will not work
1. If you concatenate strings together, the loctool
will not be able to extract that string and put it in the resource file, so the `getString()` call will
not be able to find it

In other languages, plurality rules can get even more complex. For example, in Russian, numbers that end
with the digits 2 through 4 have a different plural than ones that end with than 5 through 9. ie. 22 is a different
plural than 27. That means the above code is not translatable to Russian!

To solve this problem, you should use the `formatChoice()` method of the `IString` class. The
modified code would look like this:

```
const template = resBundle.getString("one#There is {num} object.|#There are {num} objects.");
const str = template.formatChoice(numObjects, {num: numObjects});
```

This will pick the right choice based on the value of the variable `numObjects`.
The template string for the `formatChoice()` method has a number of parts. In this example, there
are 2 choices separated by a vertical bar. The first choice is selected if the pivot number in
`numObjects` is 1
(the number before the hash character), and the resulting string should be “There is {num} object.”
The second choice has no number before the hash character, so it is the default choice. In that
case, the string returned is “There are {num} objects.” where “{num}” is replaced with the value
of objects first. After the choice is selected, `formatChoice()` formats the string using the
values of the properties in its second argument.

Note that the number to match in the first choice is "one" which is the name of a category of
numbers. In English, that category only includes the number 1, but in other languages, that category
can include many numbers that are all considered singular.

Can this support Russian? Yes, because now the translator or localization engineer is free to
add or remove choices in the translated string. In Russian, the translator can add a case for
singular numbers (the "one" category), plurals with 2 through 4 (the "few" category), and the
default case would be the one that supports 5 through 9 (the "many" category).

The Russian translation of the above string in the `locale/ru/strings.json` resource file would
look like this:

```
    "one#There is {num} object.|#There are {num} objects.": "one#Есть {num} объект.|few#Есть {num} объекта.|#Есть {num} объектов."
```

The `formatChoice()` method also has other capabilities to switch not only on numbers, but also
booleans, strings, or even regular expressions. See the [IString documentation](https://github.com/ilib-js/ilib-istring)
for more details.

### Pseudo­Translation

The resource bundle can also help your testers discover unresourcified strings using
pseudotranslation. Unresourcified strings are ones that are displayed to the user, but which
have not yet been wrapped in a `getString()` call.

To do this type of testing, you must set the default locale of ilib to a special “unknown”
locale, which is specified as “zxx-­XX”. The ilib-env package has a `setLocale()` method that
allows you to set the overall default locale for ilib which is used if no explicit locale
is set in the parameters to a constructor or method.

Example:

```
import { setLocale } from 'ilib-env';

setLocale("zxx-­XX");
```

The “unknown” locale causes the `ResBundle` class to return strings that are pseudo­localized.
That is, many of the regular Latin characters are replaced algorithmically with accented versions
of those same base characters. This is still readable by an English­-speaking QA person,
and yet they immediately know that the string was resourcified properly. If a string appears in
plain text, then it is either user-­entered data, strings from 3rd party software or services,
or it is a string that has not been resourcified properly. The QA person can submit a bug for
the engineer to investigate which of those possibilities it is, and fix the code if it turns out
to be a string that is not wrapped with a `getString()` method call.

Here is what a pseudo­localized string looks like:

```
    "Greetings from Paris": "Ĝŕëëţíñğš fŕõm Pàŕíš"
```

Things get a little tricky if the string is intended to be formatted or used in a web page. In
general, it is not a good idea to put HTML inside of a translatable string because the translators
are linguists, not programmers, and they do not fully understand the syntax of HTML. They often
translate things like CSS class names or HTML keywords. However, sometimes it is necessary to do this.

For example, if you put a link in your string like this:

```
    "Greetings from <a href='url'>{city}</a> &amp; {country}"
```

Now if you just pseudotranslated every character, you would end up with a string like this:

```
    "Ĝŕëëţíñğš fŕõm <à ĥŕëf='üŕľ'>{çíţÿ}</à> &àmþ; {çõüñţŕÿ}"
```

Obviously, that would not work as intended in the browser, as the HTML tags and entities are
also pseudotranslated, as are the replacement parameter names. In this case, you should instantiate
your ResBundle with the `type` property set to “html”, and the psuedo­translation code will
automatically parse the strings and skip any HTML tags or entities.

In the examples above, we already have the `type` property set correctly. With the type
parameter set, the above example would come out as this instead:

```
    "Ĝŕëëţíñğš fŕõm <a href='url'>{city}</a> &amp; {country}"
```

Note that the IString replacement parameters have been left alone as well. Without that, the
substitution would not work too well either!

The constructor also supports other types of strings: xml, html, text, c, raw, ruby, or template.

See the full [API reference documentation](./docs/ilibResBundle.md) for a full description of
all the parameters to the ResBundle and String classes.

## Samples

There are some simple sample projects available that illustrate using `ResBundle`, `loctool`,
and `ilib-assemble` together to localize a project.

* A sample that illustrates ResBundle usage in nodeJS
* A sample that illustrates the ResBundle usage in webOS

## License

Copyright © 2022, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

### v1.0.2

- added the documentation above

### v1.0.1

- fixed a bug where the basePath parameter to the constructor or create
  factory method was not being used properly

### v1.0.0

- initial version
- copied from ilib 14.15.2

# source-no-noun-replacement-params

Ensure that source strings do not contain replacement parameters where nouns, noun
phrases, or adjectives are substituted in to the string. That is, do not create
strings where replacement parameters are preceded by "the", "an", or "a".

Examples of bad source strings:

```plaintext
Delete the {fileType}.   (where fileType is a noun)
Would you like to create a {fileType} file?     (where fileType is an adjective)
```

There are two possible scenarios for the value of the replacement parameter, and the
fix for them is different in each scenario.

1. If the replacement parameter has a value from a fixed list of known possibilities,
   then create a separate string for each of those possibilities.

   For example, let's say that "fileType" in the first example above has the possible values
   of "file" and "folder". In this case, create two separate strings and select the
   applicable entire string in your code:

   ```plaintext
   Delete the file.
   Delete the folder.
   ```

   Code in React:

    ```javascript
        import messages from './messages.js';

        const messageMap = {
            "file": messages.deleteFile,
            "folder": messages.deleteFolder
        };
        const deleteObjString = messageMap[objectToDelete.type];

        [...]
            <MyDialog type="delete">
                <FormattedMessage {...deleteObjString} />
            </MyDialog>
    ```

    As an engineer, you may think that sharing the string is more efficient, as both strings
    are exactly the same except for the one word, but you are not really saving a lot of
    memory or disk footprint, and instead you are creating an untranslatable string.

2. If the replacement parameter has an unknown value that is possibly user-entered or
    from a 3rd party library or service, the way you avoid this problem is to make the string
    ungrammatical. That is, you still substitute the value into the string, but you make
    sure that the text being substituted is not grammatically related to the rest of the
    string. The usual way of doing this is to use a colon followed by the replacement param.

    Here is the first example again, but expressed in a non-grammatical way.

    ```plaintext
    Delete an object with this type: {fileType}
    ```

    Now when you substitute in any word for "fileType", the rest of the string does not need
    to agree with the plurality or gender of the value of "fileType".

## Why does this rule exist?

The reason is that the spelling of the nouns, adjectives, and articles can vary with the
linguistic case of that part of the sentence as well as the gender and plurality of the
noun. Even in English, whether you would use "a" or "an" depends on whether the noun
starts with a vowel, so strings where you substitute a noun might not even work properly
in English.

Example:

```plaintext
The {messageType} has been sent.
```

In this example, "messageType" can have the values "E-mail" and "direct message".

Translated to Polish:

```plaintext
{messageType} został wysłany.
```

Unfortunately, the above translation only works for masculine nouns like "E-mail".

```plaintext
E-mail został wysłany.
```

But for "direct message", which is female, we would expect to see this in the UI:

```plaintext
Wiadomość bezpośrednia została wysłana.
```

Notice that the spelling of the last 2 words is different.

Also, depending on where in the translated sentence the phrase "direct message" is
placed, the spelling of the value "direct message" itself may change, so you cannot
just translate "direct message" independently and substitute it into the translated
string and expect to get the right thing in all target languages.

The reason for this complication is that nouns and other related parts of the sentence
such as adjectives and articles have to agree in terms of their gender and plurality.
That is, a masculine noun requires masculine spelling for the article and any adjectives
that describe it.

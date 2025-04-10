/*
 * Parser.ts - parse a PO file
 *
 * Copyright © 2024 Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TranslationSet, Resource, ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';
import Locale from 'ilib-locale';

import SyntaxError from './SyntaxError';
import Tokenizer, { Token, TokenType } from './Tokenizer';
import { PluralCategory, Plural, CommentType, Comments, makeKey } from './utils';
import { pluralForms } from "./pluralforms";

/**
 * Options for the PO file parser constructor.
 */
export interface BaseParserOptions {
    /** the path to the po file */
    pathName: string,

    /** the source locale of the file */
    sourceLocale?: string | Locale,

    /** the target locale of the file */
    targetLocale?: string | Locale,

    /** the name of the project that this po file is a part of */
    projectName?: string,

    /** the type of the data in the po file. This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in. */
    datatype?: string,

    /**
     * whether the context should be included as part of the key or not
     *
     * @default false
     */
    contextInKey?: boolean
};

export interface ParserOptionsWithIgnoreCommentTypes {
    /** the set of comments to ignore */
    ignoreComments: Iterable<CommentType>
};

export interface ParserOptionsWithIgnoreAllCommentsFlag {
    /**
     * whether to ignore all comments
     *
     * @default false
     */
    ignoreComments?: boolean
};

/** Represents the state of the parser. */
enum State {
    START,
    MSGIDSTR,
    MSGIDPLSTR,
    MSGCTXTSTR,
    MSGSTR,
    PLURALSTR,
    END
};

export type ParserOptions = BaseParserOptions & (ParserOptionsWithIgnoreCommentTypes | ParserOptionsWithIgnoreAllCommentsFlag);

// used to map the the key of an array of strings to the array itself
type ArrayResources = {
    [key: string]: ResourceArray
};

type ResourceTypeSpecifier = "string" | "plural" | "array";

/** Mapping from PO comment type identifier char to enum {@link CommentType} value */
const commentTypeMap = new Map([
    [' ', CommentType.TRANSLATOR],
    ['.', CommentType.EXTRACTED],
    [',', CommentType.FLAGS],
    ['|', CommentType.PREVIOUS],
    [':', CommentType.PATHS],

    // these two are extensions to the PO format so that we can encode array resources
    ['k', CommentType.KEY],       // unique key of the resource if it is different from the source string
    ['#', CommentType.INDEX],     // index of the string in an array resource
    ['d', CommentType.DATATYPE],  // type of the data where the resource is used (like "javascript" or "python")
    ['p', CommentType.PROJECT]    // name of the project that this resource is a part of
]);

const reTargetLocale = /"Language:\s*([^ \\]+)/;
const rePathStrip = /^: *(([^: ]|:[^\d])+)(:\d+)?/;
const reDefaultDataType = /"Data-Type:\s*([^ \\]+)/;
const reDefaultProject = /"Project:\s*([^ \\]+)/;

/**
 * @class Parse a PO file
 * Represents a GNU PO resource file.
 */
class Parser {
    /** the path to the po file */
    private pathName: string;
    /** the source locale of the file */
    private sourceLocale: Locale;
    /** the target locale of the file */
    private targetLocale: Locale | undefined;
    /** the type of the data in the po file. This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in. */
    private datatype: string | undefined;
    /** the name of the project that this po file is a part of */
    private projectName: string | undefined;
    /** whether the context should be included as part of the key or not */
    private contextInKey: boolean;
    /** set of comment types that should be ignored */
    private commentsToIgnore: Set<CommentType>;

    /** Create a new PO file with the given path name. */
    constructor(options: ParserOptions) {
        if (!options) throw new Error("Parser: Missing required options in Parser constructor");

        const optionsWithDefaults = {
            ignoreComments: false,
            sourceLocale: "en-US",
            contextInKey: false,
            ...options
        }

        this.pathName = optionsWithDefaults.pathName;
        this.sourceLocale = new Locale(optionsWithDefaults.sourceLocale);
        this.targetLocale = optionsWithDefaults.targetLocale ? new Locale(optionsWithDefaults.targetLocale) : undefined;
        this.projectName = optionsWithDefaults.projectName;
        this.datatype = optionsWithDefaults.datatype;
        this.contextInKey = optionsWithDefaults.contextInKey;

        if (optionsWithDefaults.ignoreComments === true) {
            // boolean true means ignore all comments
            this.commentsToIgnore = new Set(commentTypeMap.values());
        } else if (optionsWithDefaults.ignoreComments === false) {
            // boolean false means include all comments
            this.commentsToIgnore = new Set();
        } else {
            // otherwise, it is a collection of comments to ignore
            this.commentsToIgnore = new Set(optionsWithDefaults.ignoreComments);
        }
    }

    /**
     * Parse the data string looking for the localizable strings and add them to the
     * project's translation set. This function uses a finite state machine to
     * handle the parsing.
     *
     * @param data the string to parse
     * @throws SyntaxError if there is a syntax error in the file
     * @returns the set of resources extracted from the file
     */
    parse(data: string): TranslationSet {
        const set: TranslationSet = new TranslationSet();
        const tokenizer = new Tokenizer(data);
        let state: State = State.START;
        let token: Token;
        let comment: Comments | undefined,
            context: string | undefined,
            source: string | undefined,
            translation: string | undefined,
            original: string | undefined,
            sourcePlurals: Plural | undefined,
            translationPlurals: Plural | undefined,
            category : PluralCategory | undefined,
            arrays: ArrayResources | undefined = {},
            key: string | undefined,
            type: ResourceTypeSpecifier | undefined,
            arrayIndex: number = 0,
            fileDataType: string | undefined = this.datatype,
            datatype: string | undefined,
            fileProject: string | undefined = this.projectName,
            project: string | undefined;

        let resourceIndex = 0;

        function restart() {
            project = datatype = key = type = comment = context = source = translation = original = sourcePlurals = translationPlurals = category = undefined;
            state = State.START;
        }

        // Get defaults from the file header if they are there.
        // If the target locale is set in the file, use that as the default target locale
        let match = reTargetLocale.exec(data);
        if (match && match.length > 1) {
            this.targetLocale = new Locale(match[1]);
        }
        match = reDefaultDataType.exec(data);
        if (match && match.length > 1) {
            fileDataType = match[1];
        }
        match = reDefaultProject.exec(data);
        if (match && match.length > 1) {
            fileProject = match[1];
        }

        restart();

        while (state !== State.END) {
            token = tokenizer.getToken();
            switch (state) {
                case State.START:
                    switch (token.type) {
                        case TokenType.MSGID:
                            state = State.MSGIDSTR;
                            break;
                        case TokenType.MSGIDPLURAL:
                            state = State.MSGIDPLSTR;
                            type = "plural";
                            break;
                        case TokenType.MSGCTXT:
                            state = State.MSGCTXTSTR;
                            break;
                        case TokenType.MSGSTR:
                            state = State.MSGSTR;
                            break;
                        case TokenType.COMMENT:
                            if (token.value) {
                                const tokenType = token.value[0];
                                if (tokenType === ':' && !original) {
                                    const match = rePathStrip.exec(token.value);
                                    original = (match && match.length > 1) ? match[1] : token.value;
                                }
                                const commentType = commentTypeMap.get(tokenType);
                                if (commentType === CommentType.KEY) {
                                    key = token.value.substring(2);
                                } else if (commentType === CommentType.DATATYPE) {
                                    datatype = token.value.substring(2);
                                } else if (commentType === CommentType.PROJECT) {
                                    project = token.value.substring(2);
                                } else if (commentType === CommentType.INDEX) {
                                    arrayIndex = parseInt(token.value.substring(2), 10);
                                    type = "array";
                                } else if (commentType && !this.commentsToIgnore.has(commentType)) {
                                    if (!comment) {
                                        comment = {};
                                    }
                                    if (!comment[commentType]) {
                                       comment[commentType] = [];
                                    }
                                    comment[commentType].push(token.value.substring((tokenType === ' ') ? 1 : 2));
                                } // else if it is not in the comments set, ignore it
                            }
                            break;
                        case TokenType.PLURAL:
                            if (typeof (token.category) !== 'undefined') {
                                const language = this.targetLocale?.getLanguage() ?? "en";
                                const forms = (pluralForms[language] ?? pluralForms.en).categories;
                                if (token.category >= forms.length) {
                                    restart();
                                } else {
                                    category = forms[token.category];
                                    state = State.PLURALSTR;
                                }
                            } else {
                                restart();
                            }
                            break;
                        case TokenType.END:
                        case TokenType.BLANKLINE:
                            if (source || sourcePlurals) {
                                // emit a resource
                                let res: Resource;
                                if (type === "plural") {
                                    if (!sourcePlurals) {
                                        // plural resources need to have a plural string!
                                        throw new SyntaxError(this.pathName, tokenizer.getContext());
                                    }
                                    if (!key) {
                                        key = makeKey("plural", sourcePlurals, this.contextInKey ? context : undefined);
                                    }
                                    res = new ResourcePlural({
                                        project: project ?? fileProject,
                                        key: key,
                                        sourceLocale: this.sourceLocale.getSpec(),
                                        sourceStrings: sourcePlurals,
                                        pathName: original,
                                        state: "new",
                                        comment: comment && JSON.stringify(comment),
                                        datatype: datatype ?? fileDataType,
                                        context: context,
                                        index: resourceIndex++,
                                        targetLocale: translationPlurals && this.targetLocale?.getSpec(),
                                        targetStrings: this.getTargetStrings(translationPlurals)
                                    });
                                } else if (type === "array") {
                                    // if there is an existing array resource with the same key, use that one
                                    // otherwise, create a new one and add it to the set
                                    if (key) {
                                        res = arrays[key];
                                        if (!res) {
                                            res = new ResourceArray({
                                                project: project ?? fileProject,
                                                key: key,
                                                sourceLocale: this.sourceLocale.getSpec(),
                                                source: [],
                                                pathName: original,
                                                state: "new",
                                                comment: comment && JSON.stringify(comment),
                                                datatype: datatype ?? fileDataType,
                                                context: context,
                                                index: resourceIndex++,
                                                targetLocale: this.targetLocale?.getSpec(),
                                                target: []
                                            });
                                            arrays[key] = res;
                                        }
                                        // add the source and target to the array at the right index
                                        res.source[arrayIndex] = source;
                                        if (translation) {
                                            if (!res.target) {
                                                res.target = [];
                                            }
                                            res.target[arrayIndex] = translation;
                                        }
                                    } else {
                                        // no key
                                        throw new SyntaxError(this.pathName, tokenizer.getContext());
                                    }
                                } else {
                                    if (!source) {
                                        // string resources need to have a source string!
                                        throw new SyntaxError(this.pathName, tokenizer.getContext());
                                    }
                                    if (!key) {
                                        key = makeKey("string", source, this.contextInKey ? context : undefined);
                                    }
                                    res = new ResourceString({
                                        project: project ?? fileProject,
                                        key: key,
                                        sourceLocale: this.sourceLocale.getSpec(),
                                        source: source,
                                        pathName: original,
                                        state: "new",
                                        comment: comment && JSON.stringify(comment),
                                        datatype: datatype ?? fileDataType,
                                        context: context,
                                        index: resourceIndex++,
                                        targetLocale: translation && this.targetLocale?.getSpec(),
                                        target: translation
                                    });
                                }
                                set.add(res);
                            }
                            if (token.type === TokenType.END) {
                                state = State.END;
                            } else {
                                restart();
                            }
                            break;
                        case TokenType.UNKNOWN:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                        case TokenType.STRING:
                            // ignore -- probably a header string
                            // no need to change state, as we go right back to START
                            break;
                    }
                    break;
                case State.MSGIDSTR:
                    switch (token.type) {
                        case TokenType.SPACE:
                            // ignore
                            break;
                        case TokenType.STRING:
                            if (token.value) {
                                if (token.value.length) {
                                    source = token.value;
                                }
                            }
                            state = State.START;
                            break;
                        default:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                    }
                    break;
                case State.MSGIDPLSTR:
                    switch (token.type) {
                        case TokenType.SPACE:
                            // ignore
                            break;
                        case TokenType.STRING:
                            if (token.value) {
                                if (token.value.length) {
                                    sourcePlurals = {
                                        one: source,
                                        other: token.value
                                    };
                                }
                            }
                            state = State.START;
                            break;
                        default:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                    }
                    break;
                case State.MSGCTXTSTR:
                    switch (token.type) {
                        case TokenType.SPACE:
                            // ignore
                            break;
                        case TokenType.STRING:
                            if (token.value) {
                                if (token.value.length) {
                                    context = token.value;
                                }
                            }
                            state = State.START;
                            break;
                        default:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                    }
                    break;
                case State.MSGSTR:
                    switch (token.type) {
                        case TokenType.SPACE:
                            // ignore
                            break;
                        case TokenType.STRING:
                            if (token.value) {
                                if (token.value.length) {
                                    translation = token.value;
                                }
                            }
                            state = State.START;
                            break;
                        default:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                    }
                    break;
                case State.PLURALSTR:
                    switch (token.type) {
                        case TokenType.SPACE:
                            // ignore
                            break;
                        case TokenType.STRING:
                            if (token.value && category) {
                                if (token.value.length) {
                                    if (!translationPlurals) {
                                        translationPlurals = {
                                            other: ""
                                        };
                                    }
                                    translationPlurals[category] = token.value;
                                }
                            }
                            state = State.START;
                            category = undefined;
                            break;
                        default:
                            throw new SyntaxError(this.pathName, tokenizer.getContext());
                    }
                    break;
            }
        }

        return set;
    }

    /**
     * @private
     *
     * Retrieves the appropriate plural forms for the target locale,
     * applying necessary adjustments to conform to ICU pluralization rules.
     *
     * @param translationPlurals - An object containing pluralized translation strings,
     *                              where keys represent plural categories (e.g., "one", "few", "many").
     *                              This may be `undefined` if no plural translations are provided.
     * @returns A plural object with appropriate categories for the target locale.
     */
    private getTargetStrings(translationPlurals: Plural | undefined) {
        const language = this.targetLocale?.getLanguage() ?? "en";

        switch (language) {
            case "pl":
                /*
                 * In Polish (`pl`), the plural forms defined in CLDR are: "one", "few", "many", and "other".
                 * However, PO files (due to GNU gettext limitations) only support "one", "few", and "many".
                 * ICU, on the other hand, requires an "other" category for proper pluralization (as per ICU4J).
                 * To ensure compatibility, we backfill the "other" category using the value from "many".
                 * This ensures translations are applied correctly in ICU-compliant systems/projects.
                 */
                return {
                    ...translationPlurals,
                    other: translationPlurals!.many
                }
            default:
                return translationPlurals;
        }
    }
}

export default Parser;

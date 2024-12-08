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

import { TranslationSet, ResourceString, ResourcePlural } from 'ilib-tools-common';
// @ts-expect-error -- untyped package
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
    sourceLocale: string,

    /** the target locale of the file */
    targetLocale: string,

    /** the name of the project that this po file is a part of */
    projectName: string,

    /** the type of the data in the po file. This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in. */
    datatype: string,

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

/** Mapping from PO comment type identifier char to enum {@link CommentType} value */
const commentTypeMap = new Map([
    [' ', CommentType.TRANSLATOR],
    ['.', CommentType.EXTRACTED],
    [',', CommentType.FLAGS],
    ['|', CommentType.PREVIOUS],
    [':', CommentType.PATHS]
]);

const rePathStrip = /^: *(([^: ]|:[^\d])+)(:\d+)?/;

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
    private targetLocale: Locale;
    /** the type of the data in the po file. This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in. */
    private datatype: string;
    /** the name of the project that this po file is a part of */
    private projectName: string;
    /** whether the context should be included as part of the key or not */
    private contextInKey: boolean;
    /** set of comment types that should be ignored */
    private commentsToIgnore: Set<CommentType>;

    /** Create a new PO file with the given path name. */
    constructor(options: ParserOptions) {
        if (!options) throw new Error("Parser: Missing required options in Parser constructor");

        const optionsWithDefaults = {
            ignoreComments: false,
            ...options
        }

        this.pathName = optionsWithDefaults.pathName;
        this.sourceLocale = new Locale(optionsWithDefaults.sourceLocale);
        this.targetLocale = new Locale(optionsWithDefaults.targetLocale);
        this.projectName = optionsWithDefaults.projectName;
        this.datatype = optionsWithDefaults.datatype;
        this.contextInKey = optionsWithDefaults.contextInKey ?? false;

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
            category : PluralCategory | undefined;

        let resourceIndex = 0;

        function restart() {
            comment = context = source = translation = original = sourcePlurals = translationPlurals = category = undefined;
            state = State.START;
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
                            break;
                        case TokenType.MSGCTXT:
                            state = State.MSGCTXTSTR;
                            break;
                        case TokenType.MSGSTR:
                            state = State.MSGSTR;
                            break;
                        case TokenType.COMMENT:
                            if (token.value) {
                                const type = token.value[0];
                                if (type === ':' && !original) {
                                    const match = rePathStrip.exec(token.value);
                                    original = (match && match.length > 1) ? match[1] : token.value;
                                }
                                const commentType = commentTypeMap.get(type);
                                if (commentType && !this.commentsToIgnore.has(commentType)) {
                                    if (!comment) {
                                        comment = {};
                                    }
                                    if (!comment[commentType]) {
                                       comment[commentType] = [];
                                    }
                                    comment[commentType].push(token.value.substring((type === ' ') ? 1 : 2));
                                } // else if it is in the comments set, ignore it
                            }
                            break;
                        case TokenType.PLURAL:
                            if (typeof(token.category) !== 'undefined') {
                                const language = this.targetLocale?.getLanguage() ?? "en";
                                const forms = pluralForms[language].categories || pluralForms.en.categories;
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
                                let key: string;
                                let res: ResourceString | ResourcePlural | undefined = undefined;
                                if (sourcePlurals) {
                                    key = makeKey("plural", sourcePlurals, this.contextInKey ? context : undefined);
                                    res = new ResourcePlural({
                                        project: this.projectName,
                                        key: key,
                                        sourceLocale: this.sourceLocale.getSpec(),
                                        sourceStrings: sourcePlurals,
                                        pathName: original,
                                        state: "new",
                                        comment: comment && JSON.stringify(comment),
                                        datatype: this.datatype,
                                        context: context,
                                        index: resourceIndex++,
                                        targetLocale: translationPlurals?.other && this.targetLocale?.getSpec(),
                                        targetStrings: translationPlurals
                                    });
                                } else if (source) {
                                    key = makeKey("string", source, this.contextInKey ? context : undefined);
                                    res = new ResourceString({
                                        project: this.projectName,
                                        key: key,
                                        sourceLocale: this.sourceLocale.getSpec(),
                                        source: source,
                                        pathName: original,
                                        state: "new",
                                        comment: comment && JSON.stringify(comment),
                                        datatype: this.datatype,
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
}

export default Parser;

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

// @ts-ignore
import { TranslationSet, ResourceString, ResourcePlural } from 'ilib-tools-common';
import Locale from 'ilib-locale';

import SyntaxError from './SyntaxError';
import Tokenizer, { Token, TokenType } from './Tokenizer';
import { PluralCategory, Plural, CommentType, Comments, makeKey } from './utils';
import { pluralForms } from "./pluralforms";

/**
 * Options for the PO file parser
 */
export type ParserOptions = {
    pathName?: string,
    sourceLocale?: string,
    targetLocale?: string,
    projectName?: string,
    datatype?: string,
    contextInKey?: boolean
};

/**
 * Represents the state of the parser.
 * @private
 */
enum State {
    START,
    MSGIDSTR,
    MSGIDPLSTR,
    MSGCTXTSTR,
    MSGSTR,
    PLURALSTR,
    END
};

const commentTypeMap : { [key: string]: CommentType } = {
    ' ': "translator",
    '.': "extracted",
    ',': "flags",
    '|': "previous",
    ':': "paths"
};

const rePathStrip = /^: *(([^: ]|:[^\d])+)(:\d+)?/;

/**
 * @class Parse a PO file
 * Represents a GNU PO resource file.
 */
class Parser {
    private pathName: string;
    private sourceLocale: Locale;
    private targetLocale: Locale;
    private datatype: string;
    private projectName: string;
    private contextInKey: boolean;

    private pluralCategories?: PluralCategory[];
    private commentsToIgnore: Set<string> = new Set();
    private resourceIndex: number = 0;

    /**
     * Create a new PO file with the given path name.
     * @constructor
     * @param options the options to use to create this PO file
     * @param options.sourceLocale the locale of the file
     * @param options.projectName the name of the project
     * @param options.datatype the type of the file
     * @param options.contextInKey whether the context is part of the key
     * @param options.targetLocale the locale of the file
     */
    constructor(options: ParserOptions) {
        if (!options) throw new Error("Parser: Missing required options in Parser constructor");

        this.pathName = options.pathName;
        this.sourceLocale = new Locale(options.sourceLocale);
        this.targetLocale = new Locale(options.targetLocale);
        this.projectName = options.projectName;
        this.datatype = options.datatype;
        this.contextInKey = options.contextInKey;

        this.pluralCategories = pluralForms[this.targetLocale.getLanguage() ?? "en"]?.categories || pluralForms.en.categories;
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

        this.resourceIndex = 0;

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
                                const commentType = commentTypeMap[type];
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
                            if (token.category) {
                                const language = this.targetLocale?.getLanguage() ?? "en";
                                const forms = pluralForms[language].categories || pluralForms.en.categories;
                                if (token.category >= forms.length) {
                                    restart();
                                } else {
                                    category = forms[token.category];
                                    state = State.PLURALSTR;
                                }
                            }
                            break;
                        case TokenType.END:
                        case TokenType.BLANKLINE:
                            if (source || sourcePlurals) {
                                // emit a resource
                                let key: string,
                                    res: ResourceString | ResourcePlural;
                                if (sourcePlurals) {
                                    key = makeKey("plural", sourcePlurals, this.contextInKey && context);
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
                                        index: this.resourceIndex++,
                                        targetLocale: this.targetLocale?.getSpec(),
                                        targetStrings: translationPlurals
                                    });
                                } else if (source) {
                                    key = makeKey("string", source, this.contextInKey && context);
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
                                        index: this.resourceIndex++,
                                        targetLocale: this.targetLocale?.getSpec(),
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
                                state = State.START;
                            }
                            break;
                        default:
                            restart();
                            break;
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
                                state = State.START;
                            }
                            break;
                        default:
                            restart();
                            break;
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
                                state = State.START;
                            }
                            break;
                        default:
                            restart();
                            break;
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
                                state = State.START;
                            }
                            break;
                        default:
                            restart();
                            break;
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
                                state = State.START;
                                category = undefined;
                            }
                            break;
                        default:
                            restart();
                            break;
                    }
                    break;
            }
        }

        return set;
    }
}

export default Parser;

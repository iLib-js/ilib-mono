/*
 * Tokenizer.ts - tokenize PO files
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

import { isSpace, isAlpha, isAlnum } from 'ilib-ctype';

import { unescapeQuotes } from './utils.ts';

/**
 * Defines the types of tokens that the tokenizer can return.
 */
export enum TokenType {
    START,
    END,
    STRING,
    COMMENT,
    SPACE,
    BLANKLINE,
    MSGID,
    MSGIDPLURAL,
    MSGSTR,
    MSGCTXT,
    PLURAL,
    UNKNOWN
};

/**
 * Represents a syntactic token in a PO file.
 */
export type Token = {
    type: TokenType,
    value?: string,
    category?: number
};


/**
 * @class Tokenizer
 * Tokenizes a PO file for parsing.
 */
class Tokenizer {
    private data: string;
    private index: number = 0;

    private commentsToIgnore: Set<string> = new Set();
    private datatype?: string;

    /**
     * Create a new PO file tokenizer with the given data to tokenize.
     * @constructor
     * @param data the data to tokenize
     */
    constructor(data: string) {
        if (!data) throw new Error("Tokenizer: No data to tokenize");

        this.data = data;
        this.index = 0;
    }

    /**
     * Tokenize the file and return the tokens and extra information. When this function
     * returns the END token, the token stream is exhausted and it will continue to
     * return the END token on subsequent calls.
     *
     * @returns the next token
     */
    getToken(): Token | undefined {
        let start: number,
            value: string,
            category: number;

        if (this.index >= this.data.length) {
            return {
                type: TokenType.END
            };
        } else if (this.data[this.index] === "#") {
            // extract comments
            this.index++;
            start = this.index;
            while (this.index < this.data.length && this.data[this.index] !== '\n') {
                this.index++;
            }
            return {
                type: TokenType.COMMENT,
                value: this.data.substring(start, this.index)
            };
        } else if (this.data[this.index] === '"') {
            // string
            value = "";
            while (this.data[this.index] === '"') {
                this.index++;
                start = this.index;
                while (this.index < this.data.length && this.data[this.index] !== '"') {
                    if (this.data[this.index] === '\\') {
                       // escape
                       this.index++;
                    }
                    this.index++;
                }
                value += this.data.substring(start, this.index);
                if (this.index < this.data.length && this.data[this.index] === '"') {
                    this.index++;
                }

                // look ahead to see if there is another string to concatenate
                start = this.index;
                while (this.index < this.data.length && isSpace(this.data[this.index])) {
                    this.index++;
                }
                if (this.data[this.index] !== '"') {
                    // if not, reset to the beginning of the whitespace and continue tokenizing from there
                    this.index = start;
                }
            }

            return {
                type: TokenType.STRING,
                value: unescapeQuotes(value)
            };
        } else if (isSpace(this.data[this.index])) {
            if (this.data[this.index] === '\n' && this.index < this.data.length && this.data[this.index+1] === '\n') {
                this.index += 2;
                return {
                    type: TokenType.BLANKLINE
                };
            }
            while (this.index < this.data.length && isSpace(this.data[this.index])) {
                this.index++;
            }
            return {
                type: TokenType.SPACE
            };
        } else if (isAlpha(this.data[this.index])) {
            start = this.index;
            while (this.index < this.data.length &&
                    (isAlnum(this.data[this.index]) ||
                     this.data[this.index] === '_' ||
                     this.data[this.index] === '[' ||
                     this.data[this.index] === ']')
                  ) {
                this.index++;
            }
            value = this.data.substring(start, this.index);
            if (value.length > 6 && value.startsWith("msgstr[")) {
                category = Number.parseInt(value.substring(7));
                return {
                    type: TokenType.PLURAL,
                    category
                };
            }
            switch (value) {
                case 'msgid':
                    return {
                        type: TokenType.MSGID
                    };
                case 'msgid_plural':
                    return {
                        type: TokenType.MSGIDPLURAL
                    };
                case 'msgstr':
                    return {
                        type: TokenType.MSGSTR
                    };
                case 'msgctxt':
                    return {
                        type: TokenType.MSGCTXT
                    };
            }
        }

        return {
            type: TokenType.UNKNOWN,
            value: this.data[this.index]
        };
    }

    /**
     * Return the context around the current token. This is useful for error messages.
     * @returns {string} the context around the current token
     */
    getContext(): string {
        let start = this.index;
        while (start > 0 && this.data[start] !== '\n') {
            start--;
        }
        let end = this.index;
        while (end < this.data.length && this.data[end] !== '\n') {
            end++;
        }
        const indentAmount = this.index - start;
        let indent = "";
        for (let i = 0; i < indentAmount; i++) {
            indent += " ";
        }
        indent += "^";
        return this.data.substring(start, end) + "\n" + indent;
    }
}

export default Tokenizer;

/**
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// based on https://github.com/micromark/micromark-extension-gfm-strikethrough/blob/0.6.5/index.js
// just fixed for TS compliance

// types defined manually in `types/micromark.d.ts` since micromark does not seem to export for `dist/util/*`
import classifyCharacter from "micromark/dist/util/classify-character";
import chunkedSplice from "micromark/dist/util/chunked-splice";
import resolveAll from "micromark/dist/util/resolve-all";

import type { Construct, Effects, Event, NotOkay, Okay, SyntaxExtension, Tokenizer } from "micromark/dist/shared-types";

const shallow = <T>(obj: T) => Object.assign({}, obj);

const CHAR_PLUS = 43;

const TOKEN_TYPE = {
    UNDERLINE_SEQUENCE: "underlineSequence",
    UNDERLINE_SEQUENCE_TEMPORARY: "underlineSequenceTemporary",
    UNDERLINE_TEXT: "underlineText",
    UNDERLINE: "underline",
    CHARACTER_ESCAPE: "characterEscape",
    DATA: "data",
} as const;

const EVENT_TYPE = {
    ENTER: "enter",
    EXIT: "exit",
} as const;

export interface Options {
    /**
     * Whether to allow underline with single plus like `+underline+`
     *
     * @default true
     */
    singlePlus?: boolean;
}

/** Syntax extension for `mdast-util-from-markdown` which adds underline support through `++underline++` or `+underline+` */
export const syntax = (options?: Options): SyntaxExtension => {
    const allowSinglePlus = options?.singlePlus ?? true;

    const tokenizer: Construct = {
        // @ts-expect-error: implementation as-is from micromark-extension-gfm-strikethrough@0.6.5
        tokenize: tokenizeUnderline,
        resolveAll: resolveAllUnderline,
    };

    return {
        // @ts-expect-error: implementation as-is from micromark-extension-gfm-strikethrough@0.6.5
        // even though TS complains about missing null key in Record<CodeAsKey, Construct | Construct[]> for text,
        // and insideSpan is not typed at all in SyntaxExtension
        text: { [CHAR_PLUS]: tokenizer },
        insideSpan: { null: tokenizer },
    };

    // Take events and resolve underline.
    function resolveAllUnderline(events: Event[], context: Tokenizer) {
        let index = -1;
        let underline;
        let text;
        let open;
        let nextEvents: Event[];

        // Walk through all events.
        while (++index < events.length) {
            // Find a token that can close.
            if (
                events[index][0] === EVENT_TYPE.ENTER &&
                events[index][1].type === TOKEN_TYPE.UNDERLINE_SEQUENCE_TEMPORARY &&
                events[index][1]._close
            ) {
                open = index;

                // Now walk back to find an opener.
                while (open--) {
                    // Find a token that can open the closer.
                    if (
                        events[open][0] === EVENT_TYPE.EXIT &&
                        events[open][1].type === TOKEN_TYPE.UNDERLINE_SEQUENCE_TEMPORARY &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                            events[open][1].end.offset - events[open][1].start.offset
                    ) {
                        events[index][1].type = TOKEN_TYPE.UNDERLINE_SEQUENCE;
                        events[open][1].type = TOKEN_TYPE.UNDERLINE_SEQUENCE;

                        underline = {
                            type: TOKEN_TYPE.UNDERLINE,
                            start: shallow(events[open][1].start),
                            end: shallow(events[index][1].end),
                        };

                        text = {
                            type: TOKEN_TYPE.UNDERLINE_TEXT,
                            start: shallow(events[open][1].end),
                            end: shallow(events[index][1].start),
                        };

                        // Opening.
                        nextEvents = [
                            [EVENT_TYPE.ENTER, underline, context],
                            [EVENT_TYPE.ENTER, events[open][1], context],
                            [EVENT_TYPE.EXIT, events[open][1], context],
                            [EVENT_TYPE.ENTER, text, context],
                        ];

                        // Between.
                        chunkedSplice(
                            nextEvents,
                            nextEvents.length,
                            0,
                            resolveAll(
                                // @ts-expect-error: seems to be real but not typed: https://github.com/micromark/micromark/blob/2.11.4/lib/constructs.mjs#L82
                                (context.parser.constructs.insideSpan as unknown).null as [Construct, Construct],
                                events.slice(open + 1, index),
                                context,
                            ),
                        );

                        // Closing.
                        chunkedSplice(nextEvents, nextEvents.length, 0, [
                            [EVENT_TYPE.EXIT, text, context],
                            [EVENT_TYPE.ENTER, events[index][1], context],
                            [EVENT_TYPE.EXIT, events[index][1], context],
                            [EVENT_TYPE.EXIT, underline, context],
                        ]);

                        chunkedSplice(events, open - 1, index - open + 3, nextEvents);

                        index = open + nextEvents.length - 2;
                        break;
                    }
                }
            }
        }

        return removeRemainingSequences(events);
    }

    function removeRemainingSequences(events: Event[]) {
        let index = -1;
        const length = events.length;

        while (++index < length) {
            if (events[index][1].type === TOKEN_TYPE.UNDERLINE_SEQUENCE_TEMPORARY) {
                events[index][1].type = TOKEN_TYPE.DATA;
            }
        }

        return events;
    }

    function tokenizeUnderline(effects: Effects, ok: Okay, nok: NotOkay) {
        // @ts-expect-error: idk when field events is added but it seems to be real
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const previous: number = this.previous;
        // @ts-expect-error: same as above
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const events: Event[] = this.events;
        let size = 0;

        return start;

        function start(code: number) {
            if (
                code !== CHAR_PLUS ||
                (previous === CHAR_PLUS && events[events.length - 1][1].type !== TOKEN_TYPE.CHARACTER_ESCAPE)
            ) {
                return nok(code);
            }

            effects.enter(TOKEN_TYPE.UNDERLINE_SEQUENCE_TEMPORARY);
            return more(code);
        }

        function more(code: number) {
            const before = classifyCharacter(previous);

            if (code === CHAR_PLUS) {
                // If this is the third marker, exit.
                if (size > 1) return nok(code);
                effects.consume(code);
                size++;
                return more;
            }

            if (size < 2 && !allowSinglePlus) return nok(code);
            const token = effects.exit(TOKEN_TYPE.UNDERLINE_SEQUENCE_TEMPORARY);
            const after = classifyCharacter(code);
            // @ts-expect-error: carrying over the implementation as-is from micromark-extension-gfm-strikethrough@0.6.5
            token._open = !after || (after === 2 && before);
            // @ts-expect-error: carrying over the implementation as-is from micromark-extension-gfm-strikethrough@0.6.5
            token._close = !before || (before === 2 && after);
            return ok(code);
        }
    }
};

export default syntax;

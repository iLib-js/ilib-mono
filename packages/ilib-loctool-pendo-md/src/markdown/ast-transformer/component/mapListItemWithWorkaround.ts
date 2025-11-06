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

import { Content } from "mdast";
import { UnistComponent } from "./unistComponent";

/**
 * Unescape the listItem with workaround for malformed translations.
 *
 * Explanation by 2025-11-06 @wadimw
 *
 * Given the following markdown list:
 * ```markdown
 * * **first** item
 * * second **item**
 * * **third** item
 * ```
 * this plugin will transform it into the following escaped string:
 * ```xml
 * <source>&lt;c0&gt;
 *
 * &lt;c1&gt;
 *
 * &lt;c2&gt;first&lt;/c2&gt; item
 *
 * &lt;/c1&gt;
 *
 * &lt;c3&gt;
 *
 * second &lt;c4&gt;item&lt;/c4&gt;
 *
 * &lt;/c3&gt;
 *
 * &lt;c5&gt;
 *
 * &lt;c6&gt;third&lt;/c6&gt; item
 *
 * &lt;/c5&gt;
 *
 * &lt;/c0&gt;</source>
 * ```
 *
 * The newlines are inserted by Markdown serializer for each Paragraph node - they are present there because
 * the mdast ListItem node must contain BlockContent nodes (in this case, Paragraphs). AST of this string looks like this:
 * ```text
 * |root: [
 * |    html(<c0>),
 * |    html(<c1>),
 * |    paragraph: [
 * |        html(<c2>),
 * |        text(first),
 * |        html(</c2>),
 * |        text(item)
 * |    ],
 * |    html(</c1>),
 * |    html(<c3>),
 * |    paragraph: [
 * |        text(second),
 * |        html(<c4>),
 * |        text(item),
 * |        html(</c4>)
 * |    ],
 * |    html(</c3>),
 * |    html(<c5>),
 * |    paragraph: [
 * |        html(<c6>),
 * |        text(third),
 * |        html(</c6>),
 * |        text(item)
 * |    ],
 * |    html(</c5>),
 * |    html(</c0>)
 * |]
 * ```
 *
 * Unfortunately, Mojito ignores those newlines when pushing the XLIFF produced by Loctool,
 * so the actual string for translation becomes
 *
 * ```xml
 * <source>&lt;c0> &lt;c1> &lt;c2>first&lt;/c2> item &lt;/c1> &lt;c3> second &lt;c4>item&lt;/c4> &lt;/c3> &lt;c5> &lt;c6>third&lt;/c6> item &lt;/c5> &lt;/c0></source>
 * ```
 * its AST looks like this:
 *
 * ```text
 * |root: [
 * |    paragraph: [
 * |        html(<c0>),
 * |        text( ),
 * |        html(<c1>),
 * |        text( ),
 * |        html(<c2>),
 * |        text(first),
 * |        html(</c2>),
 * |        text(item),
 * |        html(</c1>),
 * |        text( ),
 * |        html(<c3>),
 * |        text( second ),
 * |        html(<c4>),
 * |        text(item),
 * |        html(</c4>),
 * |        html(</c3>),
 * |        text( ),
 * |        html(<c5>),
 * |        text( ),
 * |        html(<c6>),
 * |        text(third),
 * |        html(</c6>),
 * |        text( item ),
 * |        html(</c5>),
 * |        text( ),
 * |        html(</c0>)
 * |    ],
 * |]
 * ```
 *
 * which after backconversion looks like this:
 *
 * ```text
 * |root: [
 * |    paragraph: [
 * |        list: [
 * |            text: " "
 * |            listItem: [
 * |                text: " "
 * |                strong: [
 * |                    text: "first"
 * |                ]
 * |            ]
 * |        ]
 * |        text: " "
 * |        listItem: [
 * |            text: " second "
 * |            strong: [
 * |                text: "item"
 * |            ]
 * |        ]
 * |        text: " "
 * |        listItem: [
 * |            text: " "
 * |            strong: [
 * |                text: "third"
 * |            ]
 * |        ]
 * |        text: " "
 * |    ]
 * |    text: " "
 * |]
 * ```
 *
 * and after rendering we get the following string:
 *
 * ```text
 * |
 * |*
 * |
 * |    **first**
 * |
 * |     item
 * |
 * |*    second
 * |
 * |    **item**
 * |
 * |
 * |
 * |*
 * |
 * |    **third**
 * |
 * |     item
 * ```
 * because without PhrasingContent node, mdast serializer inserts newline after every separate element of the list item.
 *
 * The workaround is to forcefully wrap the list item elements into a PhrasingContent node - in this case a Paragraph node.
 * This limits the amount of extraneous newlines inserted by the serializer to the minimum.
 */
export const mapListItemWithWorkaround = (component: UnistComponent): Content => {
    const hasNonBlockContent = component.children.some(
        (child) => !["paragraph", "heading", "list", "listItem"].includes(child.type)
    );
    if (hasNonBlockContent) {
        return { type: "listItem", children: [{ type: "paragraph", children: component.children as any }] };
    }
    return { type: "listItem", children: component.children as any };
};

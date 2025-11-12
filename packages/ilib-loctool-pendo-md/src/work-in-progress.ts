/**
 * Copyright © 2025, Box, Inc.
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
import { Content as MdastContent, Parent as MdastParent, Root } from "mdast";
import type { Parent as UnistParent, Literal as UnistLiteral, Node as UnistNode } from "unist";
import mapTree from "unist-util-map";
import visit from "unist-util-visit";

// on first pass, transform tree by replacing all non-text nodes

export interface Text extends UnistLiteral<string> {
    type: "text";
}

export interface Component extends UnistParent {
    type: "component";
    componentIndex?: number;
    originalNodes: UnistNode[];
    children: (Text | Component)[];
}

export const mapMdastNode = (node: MdastParent | MdastContent) => {
    // substitute nodes with children
    if ("children" in node) {
        const nodeCopy = { ...node, children: [] };
        const component: Component = {
            type: "component",
            originalNodes: [nodeCopy],
            children: node.children.map(mapMdastNode),
        };
        return component;
    }
    // pass through text literal nodes
    if (node.type === "text") {
        const text: Text = { type: "text", value: node.value };
        return text;
    }
    // escape non-parent nodes
    const component: Component = { type: "component", originalNodes: [node], children: [] };
    return component;
};

export const mdastToComponentAst = (tree: Root) => {
    return mapTree(tree, (node) => mapMdastNode(node as any));
};

// on second pass, minimize the tree by flattening stacked components

export const flattenComponentNodes = (tree: Component) => {
    const clone = mapTree(tree, (node) => node) as Component;
    visit(clone, "component", (node: Component) => {
        if (node.children.length === 1 && node.children[0].type === "component") {
            const childComponent = node.children[0] as Component;
            node.originalNodes.push(...childComponent.originalNodes);
            node.children = childComponent.children;
        }
        return visit.CONTINUE;
    });
    return clone;
};

// on third pass, assign component indices to the component nodes

export const ROOT_COMPONENT_INDEX = -1;

export const enumerateComponents = (tree: Component) => {
    const clone = mapTree(tree, (node) => node) as Component;
    let componentIndex = ROOT_COMPONENT_INDEX;
    visit(clone, "component", (node: Component) => {
        node.componentIndex = componentIndex++;
        return visit.CONTINUE;
    });
    return clone;
};

// once we have the enumerated AST, we can make a translatable string out of it

export const stringifyComponentAst = (node: Component | Text) => {
    if (node.type === "text") {
        return node.value;
    }
    if (node.type !== "component") {
        // @ts-expect-error this should be exhaustive
        throw new TypeError(`Unexpected node type: ${node.type}`);
    }
    if (node.componentIndex === undefined) {
        throw new Error(`Component index is undefined`);
    }
    if (node.children.length === 0) {
        return `<c${node.componentIndex}/>`;
    }
    const childrenString = node.children.map(stringifyComponentAst as any).join("");
    if (node.componentIndex < 0) {
        return childrenString; // root component won't actually be displayed in the translatable string
    }
    return (
        `<c${node.componentIndex}>` +
        node.children.map(stringifyComponentAst as any).join("") +
        `</c${node.componentIndex}>`
    );
};

// we need to pull the component data out of the ast for later backconversion

export const extractComponentData = (node: Component | Text) => {
    const data: Record<number, UnistNode[]> = {};
    visit(node, "component", (node: Component) => {
        if (node.componentIndex === undefined) {
            throw new Error(`Component index is undefined`);
        }

        data[node.componentIndex] = node.originalNodes;
        return visit.CONTINUE;
    });
    return data;
};

// now we should parse the translated string and make a component AST out of it
// this is the reverse operation to stringifyComponentAst

// find first occurrence of <c0> or <c0/>
const findComponentTag = (string: string, startIndex: number) => {
    const regexp = /<(?<closing>\/)?c(?<componentIndex>\d+)(?<selfClosing>\/)?>/g;
    regexp.lastIndex = startIndex;
    const match = regexp.exec(string);
    if (!match || !match.groups) {
        return null;
    }
    const componentIndex = parseInt(match.groups.componentIndex, 10);
    const isClosing = match.groups.closing !== undefined;
    const isSelfClosing = match.groups.selfClosing !== undefined;
    return { componentIndex, position: match.index, length: match[0].length, isClosing, isSelfClosing };
};

export const parseComponentString = (string: string) => {
    const tree: Component = {
        type: "component",
        componentIndex: ROOT_COMPONENT_INDEX,
        originalNodes: [],
        children: [],
    };
    const stack: Component[] = [tree];
    const currentComponent = () => stack[stack.length - 1];

    let position = 0;
    while (position < string.length) {
        const componentTag = findComponentTag(string, position);

        // extract text span between the current index and the component match index
        const textSpan = string.slice(position, componentTag?.position);
        if (textSpan) {
            currentComponent().children.push({ type: "text", value: textSpan });
        }

        if (!componentTag) {
            break;
        }

        // advance search position to after the found component
        position = componentTag.position + componentTag.length;

        if (componentTag.isClosing) {
            if (currentComponent().componentIndex !== componentTag.componentIndex) {
                throw new Error(
                    `Closing component tag mismatch at position ${componentTag.position}: expected </${
                        currentComponent().componentIndex
                    }> but got </c${componentTag.componentIndex}>`
                );
            }
            stack.pop();
            continue;
        }

        const newComponent: Component = {
            type: "component",
            componentIndex: componentTag.componentIndex,
            children: [],
            originalNodes: [],
        };
        currentComponent().children.push(newComponent);

        if (!componentTag.isSelfClosing) {
            stack.push(newComponent);
        }
    }

    if (stack.length !== 1) {
        throw new Error(
            `Unbalanced component tags: failed to find closing tag for component ${currentComponent().componentIndex}`
        );
    }

    return tree;
};

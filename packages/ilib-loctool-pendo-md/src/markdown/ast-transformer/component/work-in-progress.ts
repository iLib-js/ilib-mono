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
import { Content as MdastContent, Parent as MdastParent } from "mdast";
import type { Parent as UnistParent, Node as UnistNode } from "unist";
import mapTree from "unist-util-map";
import visit from "unist-util-visit";

// on first pass, transform tree by replacing all non-text nodes

export declare namespace ComponentAst {
    export interface Text {
        type: "text";
        value: string;
    }

    export interface Component {
        type: "component";
        componentIndex?: number;
        originalNodes?: UnistNode[];
        children?: Node[];
    }

    export type RootComponentIndex = typeof ROOT_COMPONENT_INDEX;

    export interface Root extends Component {
        componentIndex: RootComponentIndex;
        children: NonNullable<Component["children"]>;
    }

    export type Node = Root | Component | Text;
}

export const ROOT_COMPONENT_INDEX = -1 as const;

export const isComponentNode = (node: unknown): node is ComponentAst.Component => {
    if (typeof node !== "object" || node === null) {
        return false;
    }
    if (!("type" in node) || node.type !== "component") {
        return false;
    }
    if ("componentIndex" in node && typeof node.componentIndex !== "number") {
        return false;
    }
    if ("children" in node && !Array.isArray(node.children)) {
        return false;
    }
    if ("originalNodes" in node && !Array.isArray(node.originalNodes)) {
        return false;
    }
    return true;
};

export const shallowCloneNode = (node: UnistNode): UnistNode => {
    if ("children" in node && Array.isArray(node.children)) {
        return { ...node, children: [] } as UnistNode;
    }
    return { ...node };
};

export const mapMdastNode = (node: MdastParent | MdastContent): ComponentAst.Node => {
    // substitute nodes with children
    if ("children" in node) {
        const component: ComponentAst.Component = {
            type: "component",
            originalNodes: [node],
            children: [],
        };
        return component;
    }
    // pass through text literal nodes
    if (node.type === "text") {
        const text: ComponentAst.Text = { type: "text", value: node.value };
        return text;
    }
    // escape non-parent nodes
    const component: ComponentAst.Component = { type: "component", originalNodes: [node] };
    return component;
};

export const mapToComponentAst = (
    tree: UnistParent,
    mapFunction: (node: UnistNode) => ComponentAst.Node
): ComponentAst.Component => {
    return mapTree(tree, (node) => {
        const mappedNode = mapFunction(node);
        // create clones of the original nodes to avoid unexpected side effects
        if (mappedNode.type === "component" && mappedNode.originalNodes) {
            mappedNode.originalNodes = mappedNode.originalNodes.map(shallowCloneNode);
        }
        return mappedNode;
    }) as ComponentAst.Component;
};

// on second pass, minimize the tree by flattening stacked components
export const cloneTree = <T extends UnistNode>(tree: T): T => {
    return mapTree(tree, (node) => node) as T;
};

export const flattenComponentNodes = (tree: ComponentAst.Component): ComponentAst.Component => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        if (node.children?.length !== 1) {
            return visit.CONTINUE;
        }
        const child = node.children[0];
        if (!isComponentNode(child)) {
            return visit.CONTINUE;
        }
        if (!node.originalNodes || !child.originalNodes) {
            throw new Error("Invalid tree state: missing original nodes array");
        }
        node.originalNodes.push(...child.originalNodes);
        node.children = child.children;
        return visit.CONTINUE;
    });
    return clone;
};

// on third pass, assign component indices to the component nodes

export const enumerateComponents = (tree: ComponentAst.Component): ComponentAst.Root => {
    const clone = cloneTree(tree);
    let componentIndex: number = ROOT_COMPONENT_INDEX;
    visit(clone, isComponentNode, (node) => {
        node.componentIndex = componentIndex++;
        return visit.CONTINUE;
    });
    return clone as ComponentAst.Root;
};

// once we have the enumerated AST, we can make a translatable string out of it

export const stringifyComponentTree = (node: ComponentAst.Node): string => {
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
    if (node.children === undefined || node.children.length === 0) {
        return `<c${node.componentIndex}/>`;
    }
    const childrenString = node.children.map(stringifyComponentTree).join("");

    // don't stringify the root component
    if (node.componentIndex < 0) {
        return childrenString;
    }

    return `<c${node.componentIndex}>` + childrenString + `</c${node.componentIndex}>`;
};

// we need to pull the component data out of the ast for later backconversion
export type ComponentData = Map<number, UnistNode[]>;

export const extractComponentData = <Tree extends ComponentAst.Component = ComponentAst.Component>(tree: Tree) => {
    const data: ComponentData = new Map();
    visit(tree, isComponentNode, (node) => {
        if (node.componentIndex === undefined) {
            throw new Error(`Component index is undefined`);
        }

        if (!node.originalNodes) {
            throw new Error("Invalid tree state: missing original nodes array");
        }
        data.set(node.componentIndex, node.originalNodes);
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
    const tree: ComponentAst.Root = {
        type: "component",
        componentIndex: ROOT_COMPONENT_INDEX,
        children: [],
    };

    const stack: ComponentAst.Component[] = [tree];
    const currentComponent = () => stack[stack.length - 1];

    let position = 0;
    while (position < string.length) {
        const componentTag = findComponentTag(string, position);

        // extract text span between the current index and the component match index
        const textSpan = string.slice(position, componentTag?.position);
        if (textSpan) {
            let children = currentComponent().children;
            if (!children) {
                children = [];
                currentComponent().children = children;
            }
            children.push({ type: "text", value: textSpan });
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

        const newComponent: ComponentAst.Component = {
            type: "component",
            componentIndex: componentTag.componentIndex,
        };

        let children = currentComponent().children;
        if (!children) {
            children = [];
            currentComponent().children = children;
        }
        children.push(newComponent);

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

// once we have the tree, we need to inject the original nodes extracted from source

export const injectComponentData = (tree: ComponentAst.Root, componentData: ComponentData) => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        if (node.componentIndex === undefined) {
            throw new Error(`Invalid tree state: component index is undefined`);
        }
        const data = componentData.get(node.componentIndex);
        if (!data) {
            throw new Error(`Missing component data for component index ${node.componentIndex}`);
        }
        node.originalNodes = data;
        return visit.CONTINUE;
    });
    return clone;
};

// now unflatten the tree

export const unflattenComponentNodes = <Tree extends ComponentAst.Component = ComponentAst.Component>(
    tree: Tree
): Tree => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        if (!node.originalNodes) {
            throw new Error("Invalid tree state: missing original nodes array");
        }

        while (node.originalNodes.length > 1) {
            node.children = [
                {
                    type: "component",
                    children: node.children,
                    originalNodes: [node.originalNodes.pop()!],
                },
            ];
        }

        return visit.CONTINUE;
    });
    return clone;
};

// and finally reconstruct the original tree

export const mapFromComponentAst = (
    tree: ComponentAst.Component,
    mapFunction: (node: ComponentAst.Node) => UnistNode
): UnistParent => {
    return mapTree(tree, (node) => {
        return shallowCloneNode(
            mapFunction(
                // @ts-expect-error mapTree is not generic,
                // but we know that ComponentAst.Component tree can only contain ComponentAst.Node nodes
                node
            )
        );
    }) as UnistParent;
};

export const unmapMdastNode = (node: ComponentAst.Node): MdastParent | MdastContent => {
    if (node.type === "text") {
        return { type: "text", value: node.value };
    }

    if (node.type !== "component") {
        // @ts-expect-error this should be exhaustive
        throw new Error(`Unexpected node type: ${node.type}`);
    }

    if (!node.originalNodes) {
        throw new Error("Invalid tree state: missing original nodes array");
    }

    if (node.originalNodes.length !== 1) {
        throw new Error("Invalid tree state: multiple original nodes");
    }

    // we don't have a way to preserve the exact type of the original node
    return node.originalNodes[0] as any;
};

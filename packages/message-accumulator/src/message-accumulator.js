/**
 * message-accumulator.js - accumulate localizable messages
 *
 * @license
 * Copyright © 2019, JEDLSoft
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

import Node from 'ilib-tree-node';

// take care of all Unicode whitespace as well as what JS thinks is whitespace
let whiteSpaceStart = /^[\s\u2000-\u200D\u2028\u2029\u202F\u205F\u2060]+/u;
let whiteSpaceEnd = /[\s\u2000-\u200D\u2028\u2029\u202F\u205F\u2060]+$/u;
let whiteSpace = /[\s\u2000-\u200D\u2028\u2029\u202F\u205F\u2060]+/ug;

// use [\s\S]*? instead of .* with the "s" flag because node 6 and earlier throw errors about the unknown "s" flag
let re = /(<(c\d+)>[\s\S]*?<\/\2>)/g;
let first = /^<c(\d+)>/;
let selfclosing = /(<([cp](\d+))\/>)/g; // "c" for component, "p" for parameter

/**
 * MessageAccumulator.js - accumulate a translatable message as a string
 */
export default class MessageAccumulator {
    /**
     * Create a new accumulator instance.
     */
    constructor() {
        this.root = new Node({
            type: "root",
            parent: null,
            index: -1
        });
        this.currentLevel = this.root;
        this.componentIndex = 0;
        this.paramIndex = 0;
        this.text = '';
        this.mapping = {};
    }

    /**
     * Factory method to create a new MessageAccumulator instance from
     * the given string and a source message accumulator. This will
     * parse the string and create the equivalent tree from it, and
     * then attach the "extra" information from the source accumulator
     * to the equivalent nodes in the new accumulator. This includes
     * the source information for components and replacement parameters.
     *
     * @param {String} translated the translated string to parse
     * @param {MessageAccumulator} source the source message
     * for this translation
     * @returns {MessageAccumulator} a new message accumulator
     * instance equivalent to the given string
     */
    static create(str, source) {
        let ma = new MessageAccumulator();
        if (str) {
            ma._parse(str, (source && source.getMapping()) || {}, ma.root);
        }
        return ma;
    }

    /**
     * @private
     */
    _parse(string, mapping, parent) {
        let match;

        re.lastIndex = 0;
        let parts = string.split(re);

        for (var i = 0; i < parts.length; i++) {
            first.lastIndex = 0;
            selfclosing.lastIndex = 0;
            if ((match = first.exec(parts[i])) !== null) {
                const index = parseInt(match[1]);
                const len = match[0].length;
                // strip off the outer tags before processing the stuff in the middle
                const substr = parts[i].substring(len, parts[i].length - len - 1);
                const component = new Node({
                    type: 'component',
                    parent,
                    index,
                    extra: mapping && mapping[`c${index}`]
                });
                this._parse(substr, mapping, component);

                parent.add(component);
                i++; // skip the number in the next iteration
            } else if (parts[i] && parts[i].length) {
                let subparts = parts[i].split(selfclosing);
                for (var j = 0; j < subparts.length; j++) {
                    selfclosing.lastIndex = 0;
                    if ((match = selfclosing.exec(subparts[j])) !== null) {
                        const index = parseInt(match[3]);
                        parent.add(new Node({
                            type: match[2][0] === "p" ? 'param' : 'component',
                            parent,
                            index,
                            extra: mapping && mapping[match[2]]
                        }));
                        j += 2; // skip the other parts of the match in the next iteration
                    } else if (subparts[j] && subparts[j].length) {
                        // don't store empty strings
                        parent.add(new Node({
                            type: 'text',
                            value: subparts[j]
                        }));
                    }
                }
            }
        }
    }

    /**
     * Add text to the current context of the string.
     * @param {string} text the text to add
     */
    addText(text) {
        if (typeof text === 'string') {
            this.currentLevel.add(new Node({
                type: 'text',
                value: text
            }));
        }
        this.text += text;
    }

    /**
     * Add a replacement parameter to the string. This is a coding
     * for a replacement parameter in the programming language
     * or i18n library that does substitutions. By coding the replacement
     * parameters instead of leaving them in as-is, the strings are
     * normalized.<p>
     *
     * This has two advantages. First, translations for strings
     * with the same text but different replacement parameter styles
     * can be shared across i18n libraries. For
     * example, some libraries use "C" style parameters like "%1s"
     * and others use named parameters like "{name}". That means
     * the translation of "User %1s logged in." and of "User {name}
     * logged in." should have the exact same translation.<p>
     *
     * Second, the parameters can be numbered automatically so that
     * the translator has the freedom to re-arrange the parameters
     * in a string with multiple parameters as required by the
     * grammar of the target language. For some parameter styles
     * that use numbered parameters instead of named ones, the
     * caller may need to amend original parameter to insert the
     * number if the original code did not have it already. That
     * is bad style anyways and you should strongly discourage your
     * engineers from writing strings with multiple replacement
     * parameters that are unnumbered.<p>
     *
     * Parameters appear in the composed string as XML tags that
     * are distinct from the component tags. When creating a
     * translated string, the parameters are substituted back
     * into the string.
     *
     * @param {Object} extra extra information that the caller can
     * use to identify the original replacement parameter
     */
    addParam(extra) {
        let index = this.paramIndex++;
        this.currentLevel.add(new Node({
            type: 'param',
            index,
            extra,
            closed: true
        }));
        let contents = `p${index}`;
        this.text += `<${contents}/>`;
        this.mapping[contents] = extra;
    }

    /**
     * Create a new subcontext for a component such that all text
     * added to the accumulator goes into the new context.<p>
     *
     * A component is represented in the composed string as an
     * XML tag that is numbered according to the order of the
     * components in the string. This class maintains a mapping
     * between the component number and the given "extra"
     * information so that this can be used to create a translated
     * accumulator with the same extra info. (See the
     * MessageAccumulator.create static function.)
     *
     * @param {Object} extra extra information that the caller would
     * like to associate with the component. For example, this may
     * be a node in an AST from parsing the original text.
     * @param {boolean} keep true if this node should always be kept and
     * not optimized out during the getMinimalString
     */
    push(extra, keep) {
        const newNode = new Node({
            type: 'component',
            parent: this.currentLevel,
            index: this.componentIndex++,
            extra,
            closed: false,
            keep
        });
        this.currentLevel.add(newNode);
        this.currentLevel = newNode;
        this.mapping[`c${newNode.index}`] = extra;
    }

    /**
     * Pop the current context from the stack and return to the previous
     * context. If the current context is already the root, then this
     * represents an unbalanced string.
     * @returns {Object|undefined} the extra information associated with the
     * context that is being popped, or undefined if we are already at the
     * root and there is nothing to pop
     */
    pop() {
        if (!this.currentLevel.parent) {
            // oh oh, unbalanced?
            console.log('Unbalanced component error...'); // eslint-disable-line no-console
            return;
        }
        var extra = this.currentLevel.extra;
        this.currentLevel.closed = true;
        this.currentLevel = this.currentLevel.parent;
        return extra;
    }

    /**
     * @private
     */
    _getString(rootnode) {
        if (rootnode.children.length === 0) {
            return rootnode.value || "";
        }
        return rootnode.children.map(child => {
            return child.toArray().map(node => {
                if (node.type === "component") {
                    if (node.index > -1) {
                        if (node.use === "start") {
                            return `<c${node.index}>`;
                        } else if (node.use === "end") {
                            return `</c${node.index}>`;
                        } else {
                            // self-closing
                            return `<c${node.index}/>`;
                        }
                    }
                } else if (node.type === "param") {
                    // self-closing
                    return `<p${node.index}/>`;
                } else {
                    return node.value;
                }
            }).join('');
        }).join('');
    }

    /**
     * @private
     */
    _isEmpty(node) {
        whiteSpace.lastIndex = 0;
        if (node.type === "param") return false;
        if (node.type === "text" && node.value.replace(whiteSpace, '') !== "") return false;
        if (node.type === "component") {
            if (node.keep) return false;
            if (node.children && node.children.length) {
                return node.children.every(child => {
                    return this._isEmpty(child);
                });
            }
        }
        return true;
    }

    /**
     * @private
     */
    _renumber(node) {
        if (node.type === "component") {
            node.index = this.componentIndex++;
            this.mapping[`c${node.index}`] = node.extra;
        } else if (node.type === "param") {
            this.mapping[`p${node.index}`] = node.extra;
        }
        if (node.children) {
            node.children.forEach(child => {
                this._renumber(child);
            });
        }
    }

    /**
     * @private
     */
    _minimize() {
        if (this.minimized) return;

        var value, changed = true;

        if (!this.prefixes) this.prefixes = [];
        if (!this.suffixes) this.suffixes = [];

        // keep stripping off parts until we haven't changed anything, or we have stripped off everything
        while (changed && this.root.children && this.root.children.length) {
            changed = false;
            var subroot = this.root;
            // check for "outer" components -- components that surround localizable text without adding anything to it
            while (subroot.children && subroot.children.length === 1 && subroot.children[0].type !== "text" && !subroot.children[0].keep) {
                subroot = subroot.children[0];
                value = new Node(subroot);
                value.use = "start";
                this.prefixes.push(value);
                value = new Node(subroot);
                value.use = "end";
                this.suffixes = [value].concat(this.suffixes);

                changed = true;
            }

            var children = subroot.children;

            // find empty components at the start
            var i = 0;
            while (i < children.length && children[i] && this._isEmpty(children[i])) {
                this.prefixes = this.prefixes.concat(children[i].toArray());
                i++;
                changed = true;
            }

            children = i > 0 ? children.slice(i) : children;

            // then find empty components at the end
            var i = children.length - 1;
            while (i > 0 && children[i] && this._isEmpty(children[i])) {
                this.suffixes = children[i].toArray().concat(this.suffixes);
                i--;
                changed = true;
            }

            // now strip off the leading and trailing whitespace
            if (children.length && children[0].type === "text") {
                whiteSpaceStart.lastIndex = 0;
                var match = whiteSpaceStart.exec(children[0].value);
                if (match) {
                    children[0].value = children[0].value.substring(match[0].length);
                    this.prefixes.push(new Node({
                        type: "text",
                        value: match[0]
                    }));
                    changed = true;
                }
            }
            var last = children.length-1;
            if (children.length && children[last].type === "text") {
                whiteSpaceEnd.lastIndex = 0;
                var match = whiteSpaceEnd.exec(children[last].value);
                if (match) {
                    children[last].value = children[last].value.substring(0, children[last].value.length - match[0].length);
                    this.suffixes = [new Node({
                        type: "text",
                        value: match[0]
                    })].concat(this.suffixes);
                    changed = true;
                }
            }

            this.root.children = i < children.length - 1 ? children.slice(0, i+1) : children;
            // then do it all again until nothing changes!
        }

        // now walk the tree again and renumber any components so that we don't start at some number greater
        // than zero
        this.componentIndex = 0;
        this.mapping = {};
        this._renumber(this.root);

        this.minimized = true;
    }

    /**
     * Return the message accumulated so far, including any components
     * as a string that contains "c" + a number to represent those
     * components.
     *
     * @return {string} the accumulated string so far
     */
    getString() {
        return this._getString(this.root);
    }

    /**
     * Return all of the irrelevant parts of the string at the beginning
     * of the message.<p>
     *
     * For a minimal string, all of the components that are irrelevant
     * for translation are removed. This method returns all of the irrelevant
     * components and text units that appear at the beginning of the string.
     *
     * @returns {Array.<Object>} an array of "extra" and text units that
     * are irrelevant
     */
    getPrefix() {
        this._minimize();
        return this.prefixes || [];
    }

    /**
     * Return the message accumulated so far as a string, including
     * any components, and leaving out any contexts that are irrelevant
     * for translation purposes. This method is similar to getString()
     * with the irrelevant parts removed. This includes:
     *
     * <ul>
     * <li>Any components that surround the entire message
     * <li>Any components that are at the beginning or end of the message
     * and which do not have any translatable text in them.
     * <li>Any text at the beginning or end of the string that only
     * contains whitespace.
     * </ul>
     *
     * A minimal string must either start with non-whitespace text or end with
     * non-whitespace text or both.<p>
     *
     * After all the irrelevant parts are removed, the remaining components
     * are renumbered so that the first one to appear starts at zero, the
     * second one is one, etc.
     *
     * @return {string} the accumuilated string so far with all irrelevant
     * components removed.
     */
    getMinimalString() {
        this._minimize();
        return this._getString(this.root);
    }

    /**
     * Return all of the irrelevant parts of the string at the end
     * of the message.<p>
     *
     * For a minimal string, all of the components that are irrelevant
     * for translation are removed. This method returns all of the irrelevant
     * components and text units that appear at the end of the string.
     *
     * @returns {Array.<Object>} an array of "extra" and text units that
     * are irrelevant
     */
    getSuffix() {
        this._minimize();
        return this.suffixes || [];
    }

    /**
     * Return the number of characters of non-whitespace text that
     * have been accumulated so far in this accumulator. Components
     * are left out.
     * @return {number} the length of the non-whitespace text accumulated so far
     */
    getTextLength() {
        whiteSpace.lastIndex = 0;
        return this.text.replace(whiteSpace, '').trim().length;
    }

    /**
     * @private
     * Return the depth of the stack from the given node.
     */
    countCurrentLevel(node) {
        return node.parent ? this.countCurrentLevel(node.parent) + 1 : 0;
    }

    /**
     * Return the current depth of the context stack. If the accumulator is
     * currently at the root, it will return 0.
     * @returns {number} the current depth of the context stack, or 0 if there
     * is nothing on the stack yet
     */
    getCurrentLevel() {
        return this.countCurrentLevel(this.currentLevel);
    }

    /**
     * Return true if the current context is the root of the message.
     * @return {boolean} true if the current context is the root
     */
    isRoot() {
        return this.componentIndex === 0;
    }

    /**
     * Return the mapping between components and the "extra"
     * information used when creating those components.
     *
     * @param {number} componentNumber the number of the
     * component for which the "extra" information is
     * being sought
     * @returns {Object} the "extra" information that was
     * given when the component was created
     */
    getExtra(componentNumber) {
        return this.mapping[`c${componentNumber}`];
    }

    /**
     * Return the mapping between a replacement parameter
     * and the "extra" information used when creating those
     * components.
     *
     * @param {number} paramNumber the number of the
     * parameter for which the "extra" information is
     * being sought
     * @returns {Object} the "extra" information that was
     * given when the parameter was created
     */
    getParam(paramNumber) {
        return this.mapping[`p${paramNumber}`];
    }

    /**
     * Return the mappings between component names and
     * their "extra" information they represent.
     * @returns {Object} the mapping between the
     * component names and their "extra" information.
     */
    getMapping() {
        return this.mapping;
    }
}

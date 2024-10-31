/*
 * ResourceEdgeWhitespace.js - rule to check that whitespaces on edges of target match those on edges of source
 *
 * Copyright © 2023-2024 JEDLSoft
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

import { Result, withVisibleWhitespace } from "ilib-lint-common";
import ResourceRule from './ResourceRule.js';

/** Rule to check that whitespaces on edges of target match those on edges of source */
class ResourceEdgeWhitespace extends ResourceRule {
    /** @readonly */ name = "resource-edge-whitespace";
    /** @readonly */ description =
        "Ensure that if there are whitespaces on edges of source string, matching ones are there in target as well";
    /** @readonly */ link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-edge-whitespace.md";

    constructor() {
        super({});
    }

    /**
     * @override
     */
    matchString({ source, target, file, resource }) {
        if ("string" !== typeof source || "string" !== typeof target) {
            return /* don't check when either source or target string is not defined */;
        }

        const whitespaces = {
            source: this._getEdgeWhitespaces(source),
            target: this._getEdgeWhitespaces(target),
        };

        const /** @type {Result[]} */ results = [];
        const resultMetaProps = {
            id: resource.getKey(),
            rule: this,
            pathName: file,
            source,
            locale: resource.getTargetLocale()
        };

        if (whitespaces.target.leading !== whitespaces.source.leading) {
            results.push(
                new Result({
                    ...resultMetaProps,
                    severity: "error",
                    description: "Leading whitespace in target does not match leading whitespace in source",
                    highlight:
                        `Source: ` +
                        `<e0>${withVisibleWhitespace(whitespaces.source.leading)}</e0>` +
                        this._truncateFromEnd(source.slice(whitespaces.source.leading.length)) +
                        ` Target: ` +
                        `<e1>${withVisibleWhitespace(whitespaces.target.leading)}</e1>` +
                        this._truncateFromEnd(target.slice(whitespaces.target.leading.length)),
                })
            );
        }

        if (whitespaces.target.trailing !== whitespaces.source.trailing) {
            results.push(
                new Result({
                    ...resultMetaProps,
                    severity: "error",
                    description: "Trailing whitespace in target does not match trailing whitespace in source",
                    highlight:
                        `Source: ` +
                        this._truncateFromStart(source.slice(0, source.length - whitespaces.source.trailing.length)) +
                        `<e0>${withVisibleWhitespace(whitespaces.source.trailing)}</e0>` +
                        ` Target: ` +
                        this._truncateFromStart(target.slice(0, target.length - whitespaces.target.trailing.length)) +
                        `<e1>${withVisibleWhitespace(whitespaces.target.trailing)}</e1>`,
                })
            );
        }

        if (results.length > 1) return results;
        else if (results.length === 1) return results[0];
        else return undefined;
    }

    _getEdgeWhitespaces(/** @type {string} */ str) {
        const leading = (str.match(/^\s+/) ?? [""])[0];
        const trailing =
            leading.length < str.length
                ? (str.match(/\s+$/) ?? [""])[0]
                : ""; /* avoid matching twice if the string is whitespace-only */
        return {
            leading,
            trailing,
        };
    }

    _truncateFromStart(/** @type {string} */ str) {
        const maxLength = 5;
        const truncationMark = "…";

        if (str.length <= maxLength) {
            return str;
        }
        return truncationMark + str.slice(str.length - (maxLength - truncationMark.length));
    }

    _truncateFromEnd(/** @type {string} */ str) {
        const maxLength = 5;
        const truncationMark = "…";
        
        if (str.length <= maxLength) {
            return str;
        }
        return str.slice(0, maxLength - truncationMark.length) + truncationMark;
    }
}

export default ResourceEdgeWhitespace;

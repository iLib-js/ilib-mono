/*
 * testUtils.js - test utility functions
 *
 * Copyright © 2022 JEDLSoft
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

import { withVisibleWhitespace } from '../src/utils.js';

export const testUtils = {
    testVisibleWhitespaceRepresentExplicit: function(test) {
        test.expect(1);
        const subject = "\u0020\u00a0\t\r\n\v";
        const result = withVisibleWhitespace(subject);
        test.equal(result, "⎵⍽→␍␊␋");
        test.done();
    },
    
    testVisibleWhitespaceRepresentNonExplicit: function(test) {
        test.expect(1);
        const subject = "\u3000";
        const result = withVisibleWhitespace(subject);
        test.equal(result, "[U+3000]");
        test.done();
    }
};


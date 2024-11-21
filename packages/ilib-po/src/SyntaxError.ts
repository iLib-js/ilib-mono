/*
 * SyntaxError.js
 *
 * Copyright © 2024 JEDLSoft
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

/**
 * @class Error thrown when there was a syntax error in the input file
 */
class SyntaxError extends Error {
    /**
     * Create a new instance of the error
     * @param {string} filename the name of the file where the syntax error occurred
     * @param {string} message a description of the syntax error
     */
    constructor(filename: string, message: string) {
        super(`Syntax error in the input file ${filename}: ${message}`);
    }
}

export default SyntaxError;

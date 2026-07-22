/*
 * index.ts - package entry point for ilib-glyphstring
 *
 * Copyright © 2024, 2026 JEDLSoft
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

// GlyphString is the default export of the package.
export { default } from "./GlyphString";
export type { GlyphStringOptions, GlyphCharIterator } from "./GlyphString";

// GlyphIterator and its helpers are named exports.
export {
    GlyphIterator,
    defaultCompose,
} from "./GlyphIterator";
export type {
    GlyphIteratorOptions,
    CharIteratorLike,
    ComposeFn,
} from "./GlyphIterator";

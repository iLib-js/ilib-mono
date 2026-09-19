/*
 * MojitoLocale.ts - locale inheritance configuration for a Mojito repository
 *
 * Copyright © 2026 JEDLSoft
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type Locale from "ilib-locale" with { "resolution-mode": "import" };

import type { MojitoClient } from "./MojitoClient";

/** Inheritance settings for a locale in a Mojito repository. */
export type MojitoLocaleOptions = {
    /**
     * Whether this locale inherits translations. When true and `parent` is
     * omitted, it inherits from the repository's source locale.
     */
    inherits?: boolean;
    /** Explicit parent locale to inherit from. */
    parent?: Locale;
};

/**
 * A locale configured for a Mojito repository.
 *
 * This adds Mojito's inheritance behavior to an ilib {@link Locale}. A locale
 * is either fully translated, inherited from another target locale, or
 * inherited from the repository's source locale.
 */
export class MojitoLocale {
    readonly client: MojitoClient;
    readonly locale: Locale;
    readonly inherits: boolean;
    readonly parent?: Locale;

    /**
     * @param client SDK session.
     * @param locale Locale represented by this repository entry.
     * @param options Mojito inheritance settings.
     */
    constructor(client: MojitoClient, locale: Locale, options: MojitoLocaleOptions = {}) {
        if (options.parent && options.inherits === false) {
            throw new Error("MojitoLocale cannot have a parent when inheritance is disabled");
        }
        this.client = client;
        this.locale = locale;
        this.inherits = options.inherits ?? !!options.parent;
        this.parent = options.parent;
    }

    /** Whether this locale is translated independently without inheritance. */
    get isFullyTranslated(): boolean {
        return !this.inherits;
    }

    /** Whether this locale inherits directly from the repository source locale. */
    get inheritsFromSource(): boolean {
        return this.inherits && !this.parent;
    }
}

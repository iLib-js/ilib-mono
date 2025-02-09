/*
 * Copyright © 2025 JEDLSoft
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

import {extract as extractFromFile} from '@formatjs/cli-lib'
import {
    InstantiatedResource,
    NewResourceOptions,
    ResourceString,
    ResTypeString,
} from "loctool";

export interface Message {
    description: string;
    defaultMessage: string;
}

export interface Messages {
    [key: string]: Message;
}

/**
 * Extracts localizable strings from the content of React file.
 */
export async function extract(path: string): Promise<Messages> {
    const extracted = await extractFromFile([path], {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        throws: true
    });

    return JSON.parse(extracted);
}

/**
 * Maps the messages to ResourceString objects.
 */
export function mapToResources({
   messages,
   options: {sourceLocale, projectId},
   createResource,
}: {
    messages: Messages;
    options: {
        sourceLocale: string;
        projectId: string;
    };
    createResource: (
        options: NewResourceOptions<ResTypeString>
    ) => InstantiatedResource<ResTypeString>;
}): ResourceString[] {
    const resources: ResourceString[] = [];

    for (const key in messages) {
        const value = messages[key];

        const resource = createResource({
            resType: "string",
            key,
            source: value.defaultMessage,
            comment: value.description,
            sourceLocale: sourceLocale,
            project: projectId,
        });
        resources.push(resource)
    }
    return resources
}

/*
 * properties.ts - Spring-style properties loading for Mojito CLI config
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

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type {
    AuthenticationMode,
    CredentialProviderKind,
    MojitoConnectionConfig,
} from "./types";

/**
 * Parse a Spring `.properties` file into a flat key/value map.
 * Lines starting with `#` or `!` are comments. Values keep trailing spaces.
 *
 * @param text Raw properties file contents.
 * @returns Parsed properties.
 */
export function parseProperties(text: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#") || line.startsWith("!")) {
            continue;
        }
        const eq = line.indexOf("=");
        const colon = line.indexOf(":");
        let sep = -1;
        if (eq >= 0 && colon >= 0) {
            sep = Math.min(eq, colon);
        } else if (eq >= 0) {
            sep = eq;
        } else if (colon >= 0) {
            sep = colon;
        }
        if (sep < 0) {
            continue;
        }
        const key = line.slice(0, sep).trim();
        const value = line.slice(sep + 1).trim();
        if (key) {
            result[key] = value;
        }
    }
    return result;
}

/**
 * Default Mojito CLI config directory: `~/.l10n/config/cli`.
 *
 * @returns Absolute path to the CLI config directory.
 */
export function defaultCliConfigDir(): string {
    return join(homedir(), ".l10n", "config", "cli");
}

/**
 * Load and merge `application*.properties` from a Mojito CLI config directory.
 * Later files override earlier ones. Order: `application.properties`, then
 * remaining `application-*.properties` sorted alphabetically.
 *
 * @param dir Directory containing CLI properties files.
 * @returns Merged property map.
 */
export function loadPropertiesFromDir(dir: string): Record<string, string> {
    if (!existsSync(dir)) {
        return {};
    }
    const files = readdirSync(dir)
        .filter((name) => /^application.*\.properties$/i.test(name))
        .sort((a, b) => {
            if (a === "application.properties") {
                return -1;
            }
            if (b === "application.properties") {
                return 1;
            }
            return a.localeCompare(b);
        });

    const merged: Record<string, string> = {};
    for (const file of files) {
        const text = readFileSync(join(dir, file), "utf8");
        Object.assign(merged, parseProperties(text));
    }
    return merged;
}

function collectHeaderProps(props: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {};
    const prefix = "l10n.resttemplate.header.headers.";
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith(prefix)) {
            headers[key.slice(prefix.length)] = value;
        }
    }
    return headers;
}

/**
 * Map Mojito CLI `l10n.resttemplate.*` properties to {@link MojitoConnectionConfig}.
 *
 * @param props Flat properties map.
 * @returns Connection configuration derived from those properties.
 */
export function connectionConfigFromProperties(
    props: Record<string, string>,
): MojitoConnectionConfig {
    const portRaw = props["l10n.resttemplate.port"];
    const headers = collectHeaderProps(props);

    return {
        scheme: props["l10n.resttemplate.scheme"],
        host: props["l10n.resttemplate.host"],
        port: portRaw !== undefined && portRaw !== "" ? Number(portRaw) : undefined,
        authenticationMode: props["l10n.resttemplate.authentication-mode"] as
            | AuthenticationMode
            | undefined,
        username: props["l10n.resttemplate.authentication.username"],
        password: props["l10n.resttemplate.authentication.password"],
        credentialProvider: props[
            "l10n.resttemplate.authentication.credentialProvider"
        ] as CredentialProviderKind | undefined,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
    };
}

/**
 * Resolve Mojito connection settings.
 *
 * Precedence (later wins): CLI properties directory → explicit overrides.
 *
 * @param overrides Explicit configuration overrides.
 * @param options Optional CLI config directory (defaults to `~/.l10n/config/cli`).
 * @returns Merged connection configuration with defaults applied.
 */
export function resolveConnectionConfig(
    overrides: MojitoConnectionConfig = {},
    options: { configDir?: string; loadCliConfig?: boolean } = {},
): Required<
    Pick<
        MojitoConnectionConfig,
        | "scheme"
        | "host"
        | "port"
        | "contextPath"
        | "authenticationMode"
        | "credentialProvider"
        | "loginFormPath"
        | "loginPostPath"
        | "csrfTokenPath"
    >
> &
    MojitoConnectionConfig {
    const loadCliConfig = options.loadCliConfig !== false;
    const fromFiles = loadCliConfig
        ? connectionConfigFromProperties(
              loadPropertiesFromDir(options.configDir ?? defaultCliConfigDir()),
          )
        : {};

    const merged: MojitoConnectionConfig = {
        ...fromFiles,
        ...stripUndefined(overrides),
        headers: {
            ...(fromFiles.headers ?? {}),
            ...(overrides.headers ?? {}),
        },
    };

    return {
        scheme: merged.scheme ?? "http",
        host: merged.host ?? "localhost",
        port: merged.port ?? 8080,
        contextPath: normalizeContextPath(merged.contextPath ?? ""),
        authenticationMode: merged.authenticationMode ?? "STATEFUL",
        credentialProvider: merged.credentialProvider ?? "CONFIG",
        loginFormPath: stripLeadingSlash(merged.loginFormPath ?? "login"),
        loginPostPath: stripLeadingSlash(merged.loginPostPath ?? "login"),
        csrfTokenPath: stripLeadingSlash(merged.csrfTokenPath ?? "api/csrf-token"),
        username: merged.username,
        password: merged.password,
        headers: merged.headers,
    };
}

/**
 * Build the Mojito base URL from connection settings.
 *
 * @param config Resolved connection configuration.
 * @returns Base URL without a trailing slash (except bare origin).
 */
export function buildBaseUrl(config: MojitoConnectionConfig): string {
    const scheme = config.scheme ?? "http";
    const host = config.host ?? "localhost";
    const port = config.port ?? 8080;
    const contextPath = normalizeContextPath(config.contextPath ?? "");
    const defaultPort = scheme === "https" ? 443 : 80;
    const authority = port === defaultPort ? host : `${host}:${port}`;
    return `${scheme}://${authority}${contextPath}`;
}

function normalizeContextPath(contextPath: string): string {
    if (!contextPath || contextPath === "/") {
        return "";
    }
    const withLeading = contextPath.startsWith("/") ? contextPath : `/${contextPath}`;
    return withLeading.replace(/\/+$/, "");
}

function stripLeadingSlash(value: string): string {
    return value.replace(/^\/+/, "");
}

function stripUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
    const result: Partial<T> = {};
    for (const [key, entry] of Object.entries(value)) {
        if (entry !== undefined) {
            (result as Record<string, unknown>)[key] = entry;
        }
    }
    return result;
}

/*
 * mojito-config.ts - interpretation of Mojito CLI connection settings
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

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { Properties } from "./properties";
import type {
    AuthenticationMode,
    CredentialProviderKind,
    MojitoConnectionConfig,
} from "./types";

const HEADER_PREFIX = "l10n.resttemplate.header.headers.";

/**
 * Profiles used by the common local `mojito` / `mojito-prod` wrappers:
 * `--spring.profiles.active=cli,formlogincredentialprovider`.
 */
export const DEFAULT_CLI_PROFILES = ["cli", "formlogincredentialprovider"] as const;

/**
 * Options for loading Mojito CLI properties from disk.
 *
 * Matches Spring Boot CLI layering, not "every file in the directory":
 *
 * - Prefer an explicit ordered {@link MojitoConfigLoadOptions.configFiles} list.
 * - Or pass {@link MojitoConfigLoadOptions.configDir} plus
 *   {@link MojitoConfigLoadOptions.profiles} to load
 *   `application.properties` then `application-{profile}.properties` for each
 *   profile, in order (later files win).
 */
export type MojitoConfigLoadOptions = {
    /**
     * Directory that holds `application*.properties`, used when
     * {@link MojitoConfigLoadOptions.configFiles} is omitted.
     * Default: `~/.l10n/config/cli`.
     */
    configDir?: string;
    /**
     * Spring-style active profiles. Used only when {@link configFiles} is
     * omitted. Default: {@link DEFAULT_CLI_PROFILES}.
     */
    profiles?: readonly string[];
    /**
     * Explicit property files to layer, in order (later wins). Paths may be
     * absolute, `~/…`, or relative to {@link configDir} (or cwd when no dir).
     * Missing files are skipped, like Spring `optional:` locations.
     */
    configFiles?: readonly string[];
    /** When false, skip CLI files and use only explicit settings. Default: true. */
    loadCliConfig?: boolean;
};

/**
 * Resolved Mojito connection settings.
 *
 * Interprets `l10n.resttemplate.*` properties and explicit
 * {@link MojitoConnectionConfig} values: typed fields, defaults, path
 * normalization, header maps, and the base URL.
 */
export class MojitoConfig implements MojitoConnectionConfig {
    /** URL scheme (`http` or `https`). */
    readonly scheme: string;
    /** Mojito host. */
    readonly host: string;
    /** Mojito port. */
    readonly port: number;
    /** Context path with a leading slash and no trailing slash, or empty. */
    readonly contextPath: string;
    /** Authentication mode. */
    readonly authenticationMode: AuthenticationMode;
    /** Username for STATEFUL form login, when configured. */
    readonly username?: string;
    /** Password for STATEFUL form login, when configured. */
    readonly password?: string;
    /** Credential source for STATEFUL auth. */
    readonly credentialProvider: CredentialProviderKind;
    /** Static headers for HEADER mode. Empty when none are configured. */
    readonly headers: Record<string, string>;
    /** Relative login form path, without a leading slash. */
    readonly loginFormPath: string;
    /** Relative login POST path, without a leading slash. */
    readonly loginPostPath: string;
    /** Relative CSRF token path, without a leading slash. */
    readonly csrfTokenPath: string;

    /**
     * Interpret an explicit connection config and fill in defaults.
     *
     * Does not read CLI property files. Use {@link MojitoConfig.resolve} or
     * {@link MojitoConfig.fromProperties} for that.
     *
     * @param config Explicit settings. Omitted fields receive defaults.
     */
    constructor(config: MojitoConnectionConfig = {}) {
        this.scheme = config.scheme ?? "http";
        this.host = config.host ?? "localhost";
        this.port = config.port ?? 8080;
        this.contextPath = normalizeContextPath(config.contextPath ?? "");
        this.authenticationMode = config.authenticationMode ?? "STATEFUL";
        this.credentialProvider = config.credentialProvider ?? "CONFIG";
        this.loginFormPath = stripLeadingSlash(config.loginFormPath ?? "login");
        this.loginPostPath = stripLeadingSlash(config.loginPostPath ?? "login");
        this.csrfTokenPath = stripLeadingSlash(config.csrfTokenPath ?? "api/csrf-token");
        this.username = config.username;
        this.password = config.password;
        this.headers = { ...(config.headers ?? {}) };
    }

    /**
     * Default Mojito CLI config directory: `~/.l10n/config/cli`.
     *
     * @returns Absolute path to the CLI config directory.
     */
    static defaultCliConfigDir(): string {
        return join(homedir(), ".l10n", "config", "cli");
    }

    /**
     * Resolve the ordered property-file paths that {@link MojitoConfig.resolve}
     * would load for the given options.
     *
     * Does not read the files. Missing paths stay in the list so callers can
     * inspect the intended layering; {@link loadPropertiesFromFiles} skips them.
     *
     * @param options Load options (`configFiles`, or `configDir` + `profiles`).
     * @returns Absolute file paths in merge order (later wins).
     */
    static resolveCliConfigFiles(options: MojitoConfigLoadOptions = {}): string[] {
        if (options.configFiles && options.configFiles.length > 0) {
            const baseDir = options.configDir
                ? expandUserPath(options.configDir)
                : process.cwd();
            return options.configFiles.map((file) => resolveConfigPath(file, baseDir));
        }

        const dir = expandUserPath(options.configDir ?? MojitoConfig.defaultCliConfigDir());
        const profiles = options.profiles ?? DEFAULT_CLI_PROFILES;
        const files = [join(dir, "application.properties")];
        for (const profile of profiles) {
            const name = profile.trim();
            if (name) {
                files.push(join(dir, `application-${name}.properties`));
            }
        }
        return files;
    }

    /**
     * Interpret `l10n.resttemplate.*` keys from parsed properties.
     *
     * Explicit overrides win over property values. Header maps are merged by
     * header name, with overrides winning. Defaults fill anything still unset.
     *
     * @param props Parsed properties.
     * @param overrides Explicit settings applied after the properties.
     * @returns Resolved configuration.
     */
    static fromProperties(
        props: Properties,
        overrides: MojitoConnectionConfig = {},
    ): MojitoConfig {
        return new MojitoConfig(mergeConfig(interpretProperties(props), overrides));
    }

    /**
     * Load CLI property files, interpret them, then apply explicit overrides.
     *
     * Precedence (later wins): layered CLI property files, then `overrides`.
     *
     * Layering matches the Mojito CLI / Spring Boot model:
     * 1. Explicit {@link MojitoConfigLoadOptions.configFiles} when provided, or
     * 2. `application.properties` plus `application-{profile}.properties` for
     *    each entry in {@link MojitoConfigLoadOptions.profiles}
     *    (default {@link DEFAULT_CLI_PROFILES}) under {@link MojitoConfigLoadOptions.configDir}.
     *
     * Missing files are skipped. This does **not** load every
     * `application-*.properties` file in the directory.
     *
     * @param overrides Explicit configuration overrides.
     * @param options CLI file / profile selection and whether to load them.
     * @returns Resolved configuration.
     */
    static resolve(
        overrides: MojitoConnectionConfig = {},
        options: MojitoConfigLoadOptions = {},
    ): MojitoConfig {
        const loadCliConfig = options.loadCliConfig !== false;
        const props = loadCliConfig
            ? loadPropertiesFromFiles(MojitoConfig.resolveCliConfigFiles(options))
            : Properties.empty();
        return MojitoConfig.fromProperties(props, overrides);
    }

    /**
     * Build the Mojito base URL from these settings.
     *
     * Default ports are omitted from the authority (`80` for http, `443` for https).
     *
     * @returns Base URL without a trailing slash.
     */
    baseUrl(): string {
        const defaultPort = this.scheme === "https" ? 443 : 80;
        const authority = this.port === defaultPort ? this.host : `${this.host}:${this.port}`;
        return `${this.scheme}://${authority}${this.contextPath}`;
    }
}

/**
 * Map `l10n.resttemplate.*` keys onto connection fields. Missing keys stay unset.
 *
 * @param props Parsed properties.
 * @returns Connection fields that were present. No defaults are applied.
 */
function interpretProperties(props: Properties): MojitoConnectionConfig {
    const portRaw = props.get("l10n.resttemplate.port");
    const headers = collectHeaderProps(props);
    const authenticationMode = props.get("l10n.resttemplate.authentication-mode") as
        | AuthenticationMode
        | undefined;
    const credentialProvider = props.get(
        "l10n.resttemplate.authentication.credentialProvider",
    ) as CredentialProviderKind | undefined;

    return {
        scheme: props.get("l10n.resttemplate.scheme"),
        host: props.get("l10n.resttemplate.host"),
        port: portRaw !== undefined && portRaw !== "" ? Number(portRaw) : undefined,
        authenticationMode,
        username: props.get("l10n.resttemplate.authentication.username"),
        password: props.get("l10n.resttemplate.authentication.password"),
        credentialProvider,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
    };
}

/**
 * Collect `l10n.resttemplate.header.headers.*` into a header name/value map.
 * The property key suffix is the header name.
 *
 * @param props Parsed properties.
 * @returns Header map. Empty when no header properties are present.
 */
function collectHeaderProps(props: Properties): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const [key, value] of props.entries()) {
        if (key.startsWith(HEADER_PREFIX)) {
            headers[key.slice(HEADER_PREFIX.length)] = value;
        }
    }
    return headers;
}

/**
 * Load and merge property files in order. Later files override earlier keys.
 * Missing paths are skipped.
 *
 * @param files Absolute property-file paths.
 * @returns Merged properties.
 */
function loadPropertiesFromFiles(files: readonly string[]): Properties {
    let merged = Properties.empty();
    for (const file of files) {
        if (!existsSync(file)) {
            continue;
        }
        const text = readFileSync(file, "utf8");
        merged = merged.merge(Properties.parse(text));
    }
    return merged;
}

/**
 * Expand `~` / `$HOME` at the start of a path.
 *
 * @param value Path that may start with `~`.
 * @returns Absolute path when `~` was used; otherwise the original string.
 */
function expandUserPath(value: string): string {
    if (value === "~") {
        return homedir();
    }
    if (value.startsWith("~/") || value.startsWith("~\\")) {
        return join(homedir(), value.slice(2));
    }
    return value;
}

/**
 * Resolve one config path against a base directory, expanding `~`.
 *
 * @param value Absolute, `~/…`, or relative path.
 * @param baseDir Directory used for relative paths.
 * @returns Absolute filesystem path.
 */
function resolveConfigPath(value: string, baseDir: string): string {
    const expanded = expandUserPath(value);
    if (isAbsolute(expanded)) {
        return expanded;
    }
    return resolve(baseDir, expanded);
}

/**
 * Overlay explicit settings onto interpreted properties.
 * Undefined override fields do not erase a value that came from properties.
 * Header maps are merged by name.
 *
 * @param base Settings interpreted from properties.
 * @param overrides Explicit settings.
 * @returns Merged settings, still without defaults.
 */
function mergeConfig(
    base: MojitoConnectionConfig,
    overrides: MojitoConnectionConfig,
): MojitoConnectionConfig {
    return {
        ...base,
        ...stripUndefined(overrides),
        headers: {
            ...(base.headers ?? {}),
            ...(overrides.headers ?? {}),
        },
    };
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

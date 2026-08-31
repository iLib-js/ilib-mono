/*
 * CSV.ts - CSV parser and serializer
 *
 * Copyright © 2020, 2023, 2025-2026 JEDLSoft
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

/** Column schema: name and optional key flag */
export interface ColumnSpec {
    name: string;
    key?: boolean;
}

/** Options for the CSV constructor (matches ilib-po POFileOptions pattern) */
export interface CSVOptions {
    /** Path to the CSV file (for metadata; caller handles file I/O) */
    pathName?: string;
    /** Row separator regex for parsing (default: /[\n\r\f]+/) */
    rowSeparator?: string | RegExp;
    /** Alternative: regex for row separation */
    rowSeparatorRegex?: RegExp;
    /** Row separator for output (default: '\n') */
    outputRowSeparator?: string;
    /** Column separator character (default: ',') */
    columnSeparator?: string;
    /** Whether first row is header (default: true) */
    headerRow?: boolean;
    /** Column schema; if undefined and headerRow, inferred from first row */
    columns?: (string | ColumnSpec)[];
}

/** CSV record: object keyed by column name */
export type CSVRecord = Record<string, string>;

/**
 * Split a single CSV line into fields, handling quoted strings and escaped separators.
 */
function splitLine(line: string, columnSeparator: string): string[] {
    const results: string[] = [];
    let current = "";
    let inQuotes = false;
    const len = line.length;

    for (let i = 0; i < len; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < len && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (
                ch === "\\" &&
                i + 1 < len &&
                line[i + 1] === columnSeparator
            ) {
                current += columnSeparator;
                i++;
            } else if (ch === columnSeparator) {
                results.push(current.trim());
                current = "";
            } else {
                current += ch;
            }
        }
    }
    results.push(current.trim());
    return results;
}

/**
 * Escape a field for CSV output.
 */
function escapeField(value: unknown, columnSeparator: string): string {
    const str = String(value ?? "");
    if (
        str.indexOf(columnSeparator) > -1 ||
        str.trim() !== str ||
        str.indexOf("\n") > -1 ||
        str.indexOf('"') > -1
    ) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

/**
 * CSV class representing a CSV file.
 * No file I/O; caller reads file and passes to parse(), takes string from generate() and writes.
 * Matches ilib-po POFile and ilib-xliff Xliff pattern.
 */
export class CSV {
    private _options: CSVOptions;

    /**
     * Create a new CSV instance with the given options.
     *
     * @param options - Parse/serialize options
     */
    constructor(options: CSVOptions = {}) {
        this._options = { ...options };
    }

    /**
     * Parse CSV/TSV text and return an array of records.
     *
     * @param data - The string to parse
     * @returns Array of record objects
     */
    parse(data: string | null | undefined): CSVRecord[] {
        return this._doParse(data ?? "", this._options);
    }

    /**
     * Generate CSV/TSV text from records.
     *
     * @param records - The records to serialize
     * @returns CSV text string
     */
    generate(records: CSVRecord[]): string {
        return this._doSerialize(records, this._options);
    }

    /**
     * Get the path name of this CSV file (if set).
     */
    getPathName(): string | undefined {
        return this._options.pathName;
    }

    private _doParse(data: string, options: CSVOptions): CSVRecord[] {
        if (!data || typeof data !== "string") {
            return [];
        }

        const rowSeparatorRegex =
            options.rowSeparatorRegex ??
            (options.rowSeparator
                ? new RegExp(
                        typeof options.rowSeparator === "string"
                            ? options.rowSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                            : String(options.rowSeparator)
                    )
                : /[\n\r\f]+/);
        const columnSeparator = options.columnSeparator ?? ",";
        const headerRow =
            typeof options.headerRow === "boolean" ? options.headerRow : true;
        let columns = options.columns;

        const lines = data
            .split(rowSeparatorRegex)
            .filter((line) => line && line.trim().length > 0);

        if (lines.length === 0) {
            return [];
        }

        if (headerRow) {
            if (!columns) {
                const names = splitLine(lines[0], columnSeparator);
                if (names && names.length) {
                    columns = names.map((name) => ({ name }));
                }
            }
            lines.shift();
        }

        if (!columns || columns.length === 0) {
            return [];
        }

        return lines.map((line) => {
            const fields = splitLine(line, columnSeparator);
            const record: CSVRecord = {};
            columns!.forEach((col, i) => {
                const name = typeof col === "string" ? col : col.name;
                record[name] = i < fields.length ? fields[i] : "";
            });
            return record;
        });
    }

    private _doSerialize(records: CSVRecord[], options: CSVOptions): string {
        if (!records || !Array.isArray(records) || records.length === 0) {
            return "";
        }

        const rowSeparator =
            options.outputRowSeparator ??
            (typeof options.rowSeparator === "string" ? options.rowSeparator : "\n");
        const columnSeparator = options.columnSeparator ?? ",";
        const headerRow =
            typeof options.headerRow === "boolean" ? options.headerRow : true;

        let columns = options.columns;
        if (!columns) {
            columns = Object.keys(records[0]).map((name) => ({ name }));
        }

        const colNames = columns.map((c) =>
            typeof c === "string" ? c : (c as ColumnSpec).name
        );
        const header = headerRow
            ? colNames
                    .map((n) => escapeField(n, columnSeparator))
                    .join(columnSeparator) + rowSeparator
            : "";

        const rows = records
            .map((record) =>
                colNames
                    .map((name) => escapeField(record[name], columnSeparator))
                    .join(columnSeparator)
            )
            .join(rowSeparator);

        return header + rows;
    }
}

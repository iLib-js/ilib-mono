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
    /** Row separator regex for parsing (default: /[\n\r\f]+/). Applied only outside quotes. */
    rowSeparator?: string | RegExp;
    /** Alternative: regex for row separation. Applied only outside quotes. */
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
 * Length of `regex` matching `data` at `index`, or 0. Empty matches are ignored.
 */
function matchLengthAt(regex: RegExp, data: string, index: number): number {
    const flags = `${regex.flags.replace(/[gy]/g, "")}y`;
    const sticky = new RegExp(regex.source, flags);
    sticky.lastIndex = index;
    const match = sticky.exec(data);
    return match && match[0].length > 0 ? match[0].length : 0;
}

function rowSeparatorFromOptions(options: CSVOptions): RegExp {
    if (options.rowSeparatorRegex) {
        return options.rowSeparatorRegex;
    }
    if (options.rowSeparator instanceof RegExp) {
        return options.rowSeparator;
    }
    if (typeof options.rowSeparator === "string") {
        return new RegExp(
            options.rowSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
    }
    return /[\n\r\f]+/;
}

/**
 * Split CSV text into rows of fields. Quote state spans row separators so
 * CR/LF/CRLF/FF inside quotes are field data. Quoted fields are not trimmed;
 * unquoted fields are.
 */
function parseRows(
    data: string,
    columnSeparator: string,
    rowSeparatorRegex: RegExp
): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;
    let fieldQuoted = false;
    let rowHasQuoted = false;
    let sawColumnSeparator = false;
    let i = 0;
    const len = data.length;
    const sepLen = columnSeparator.length;

    /* Close the current field and append it to the row. Quoted text is kept
     * as-is; unquoted text is trimmed.
     */
    const pushField = () => {
        row.push(fieldQuoted ? field : field.trim());
        field = "";
        fieldQuoted = false;
    };

    /* Close the last field of the row and emit the row unless it is blank
     * (no column separators, no quoted fields, every value empty).
     */
    const finishRow = () => {
        pushField();
        const blank =
            !rowHasQuoted &&
            !sawColumnSeparator &&
            row.every((value) => value.length === 0);
        if (!blank) {
            rows.push(row);
        }
        row = [];
        sawColumnSeparator = false;
        rowHasQuoted = false;
    };

    // Walk the string once. Accumulate the current field; a column separator
    // outside quotes finishes that field and pushes it onto the row immediately.
    // A row separator outside quotes finishes the last field and commits the
    // row. A backslash before the column separator outside quotes inserts that
    // separator as field data. Quotes only change whether separators are syntax
    // or field data: "" is one literal quote, and CR/LF/CRLF inside quotes stay
    // in the field. Unquoted space or tab around a quoted field is skipped;
    // whitespace inside the quotes is kept.

    while (i < len) {
        const ch = data[i];

        if (inQuotes) {
            if (ch === '"' && i + 1 < len && data[i + 1] === '"') {
                field += '"';
                i += 2;
                continue;
            }
            if (ch === '"') {
                inQuotes = false;
                i++;
                continue;
            }
            field += ch;
            i++;
            continue;
        }

        const rowSepLen = matchLengthAt(rowSeparatorRegex, data, i);
        if (rowSepLen > 0) {
            finishRow();
            i += rowSepLen;
            continue;
        }

        if (ch === '"') {
            inQuotes = true;
            fieldQuoted = true;
            rowHasQuoted = true;
            if (field.trim() === "") {
                field = "";
            }
            i++;
            continue;
        }

        if (
            ch === "\\" &&
            sepLen > 0 &&
            i + 1 < len &&
            data.startsWith(columnSeparator, i + 1)
        ) {
            field += columnSeparator;
            i += 1 + sepLen;
            continue;
        }

        if (sepLen > 0 && data.startsWith(columnSeparator, i)) {
            pushField();
            sawColumnSeparator = true;
            i += sepLen;
            continue;
        }

        // Unquoted padding after a quoted field. Never skip the column
        // separator itself (a tab in TSV is a field break, not padding).
        if (
            fieldQuoted &&
            (ch === " " || ch === "\t") &&
            ch !== columnSeparator
        ) {
            i++;
            continue;
        }

        field += ch;
        i++;
    }

    if (
        inQuotes ||
        fieldQuoted ||
        field.length > 0 ||
        row.length > 0 ||
        sawColumnSeparator
    ) {
        finishRow();
    }

    return rows;
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
     * Quoted fields may contain row separators (including CR, LF, and CRLF)
     * and keep leading and trailing whitespace inside the quotes. Unquoted
     * fields are trimmed, as is unquoted space or tab around a quoted field.
     * `columnSeparator` and the row separator apply only outside of quotes.
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

        const rowSeparatorRegex = rowSeparatorFromOptions(options);
        const columnSeparator = options.columnSeparator ?? ",";
        const headerRow =
            typeof options.headerRow === "boolean" ? options.headerRow : true;
        let columns = options.columns;

        const lines = parseRows(data, columnSeparator, rowSeparatorRegex);

        if (lines.length === 0) {
            return [];
        }

        if (headerRow) {
            if (!columns) {
                const names = lines[0];
                if (names && names.length) {
                    columns = names.map((name) => ({ name }));
                }
            }
            lines.shift();
        }

        if (!columns || columns.length === 0) {
            return [];
        }

        return lines.map((fields) => {
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

import fs from "fs";

/**
 * Asserts that a file exists
 * @param path - The path to the file
 */
export const expectFile = (path: string) => {
    expect(fs.existsSync(path)).toBe(true);
};

/**
 * Asserts that a file matches a snapshot
 *
 * It will also throw if the file does not exist.
 *
 * @param path - The path to the file
 */
export const expectFileToMatchSnapshot = (path: string) => {
    expect(fs.readFileSync(path, "utf8")).toMatchSnapshot();
};

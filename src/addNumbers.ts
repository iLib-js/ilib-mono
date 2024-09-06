import { readFileSync } from "node:fs";

export const addNumbers = (a: number, b: number): number => a + b;

// unnecessary async to test linting
export const addNumbersAsync = async (a: number, b: number): Promise<number> => a + b;

// use node:fs to validate node env config
export const addNumbersFromFs = (aFile: string, bFile: string): number => {
    const a = parseInt(readFileSync(aFile, "utf8"));
    const b = parseInt(readFileSync(bFile, "utf8"));
    return a + b;
};

export default addNumbers;

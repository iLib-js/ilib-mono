declare module "ilib-istring" {
    interface CharIterator {
        hasNext(): boolean;
        next(): string | undefined;
    }

    export default class IString {
        constructor(string?: string | IString, options?: object);
        init(
            string?: string | IString,
            options?: object,
            sync?: boolean
        ): void | Promise<IString>;
        static create(
            string?: string | IString,
            options?: object
        ): Promise<IString>;
        charIterator(): CharIterator;
        forEach(callback: (ch: string) => void): void;
        static fromCodePoint(codepoint: number): string;
        static toCodePoint(str: string, index?: number): number;
    }
}

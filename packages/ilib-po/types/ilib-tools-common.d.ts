// note(wwawrzenczak) 2024-11-26:
// This declaration file is a temporary solution to make the ilib-po package compile.
// Once types are provided by the ilib-tools-common package, it should be removed.

module "ilib-tools-common" {
    class TranslationSet {
        getAll(): any[];
        get(hashKey: any): any;
        add(resource: any): void;
        size(): number;
    }

    class Resource {
        constructor(props: any);
        source: any | Array<any | undefined>;
        target: any | Array<any | undefined>;
    }

    class ResourceString extends Resource {
        constructor(props: any);
        static hashKey(...props: any[]): string;
    }
    class ResourceArray extends Resource {
        constructor(props: any);
    }
    class ResourcePlural extends Resource {
        constructor(props: any);
    }

}

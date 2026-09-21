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
        source: any;
        target: any;
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

    interface Escaper {
        escape(str: string): string;
        unescape(str: string): string;
    }

    type EscaperStyle =
        | "cpp"
        | "cpp-char"
        | "cpp-raw"
        | "cpp-wide"
        | "cpp-utf8"
        | "cpp-utf16"
        | "cpp-utf32"
        | "csharp"
        | "c#"
        | "csharp-raw"
        | "c#-raw"
        | "csharp-verbatim"
        | "c#-verbatim"
        | "kotlin"
        | "kotlin-raw"
        | "java"
        | "java-raw"
        | "json"
        | "js"
        | "js-template"
        | "javascript"
        | "javascript-template"
        | "php"
        | "php-double"
        | "php-single"
        | "php-heredoc"
        | "php-nowdoc"
        | "scala"
        | "scala-raw"
        | "scala-triple"
        | "scala-char"
        | "smarty"
        | "smarty-double"
        | "smarty-single"
        | "python"
        | "python-raw"
        | "python-byte"
        | "python-multi"
        | "swift"
        | "swift-multi"
        | "swift-extended"
        | "po"
        | "uri"
        | "url"
        | "html"
        | "xml"
        | "xml-attr";

    function escaperFactory(style: EscaperStyle): Escaper | undefined;
}

/*
 * ilib-tools-common is plain JS; TypeScript may infer parsePath with fewer parameters.
 * Align declarations with packages/ilib-tools-common/src/utils.js.
 */
declare module "ilib-tools-common" {
    export function parsePath(
        template: string,
        pathname: string,
        sourceLocale?: string
    ): Record<string, string>;

    export function formatPath(
        template: string,
        parameters: Record<string, unknown> & {
            sourcepath?: string;
            locale?: string;
        }
    ): string;
}

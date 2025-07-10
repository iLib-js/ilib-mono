import { execFile } from "child_process";

export class LintRunner {
    constructor(private readonly cwd: string, private readonly lintPath: string = "node_modules/.bin/ilib-lint") {}

    run(...args: string[]): Promise<{ stdout: string; stderr: string; code: number | null }> {
        return new Promise((resolve, reject) => {
            execFile(this.lintPath, args, { cwd: this.cwd }, (error, stdout, stderr) => {
                if (error && !error.message.startsWith("Command failed")) {
                    reject(error);
                }
                resolve({
                    stdout,
                    stderr,
                    code: error?.code ?? null,
                });
            });
        });
    }
}

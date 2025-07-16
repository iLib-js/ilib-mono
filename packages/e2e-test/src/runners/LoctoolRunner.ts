import { execFile } from "child_process";

export class LoctoolRunner {
    constructor(private readonly cwd: string, private readonly loctoolPath: string = "node_modules/.bin/loctool") {}

    run(...args: string[]): Promise<{ stdout: string; stderr: string; code: number | null }> {
        return new Promise((resolve, reject) => {
            execFile(this.loctoolPath, args, { cwd: this.cwd }, (error, stdout, stderr) => {
                if (error) {
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

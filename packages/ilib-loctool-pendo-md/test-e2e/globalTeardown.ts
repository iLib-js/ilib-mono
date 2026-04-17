/**
 * Remove E2E sample outputs so `pnpm test` / `pnpm test:e2e` do not leave generated files in samples/.
 * Same paths as FSSnapshot in samples.e2e.test.ts (see sampleE2eArtifactPaths.ts).
 */
import fs from "fs";
import { getSampleE2eArtifactPaths } from "./sampleE2eArtifactPaths";

function removeFileIfPresent(file: string): void {
    try {
        fs.unlinkSync(file);
    } catch (e: unknown) {
        const err = e as NodeJS.ErrnoException;
        if (err.code !== "ENOENT") {
            throw e;
        }
    }
}

export default function globalTeardown(): void {
    for (const file of getSampleE2eArtifactPaths()) {
        removeFileIfPresent(file);
    }
}

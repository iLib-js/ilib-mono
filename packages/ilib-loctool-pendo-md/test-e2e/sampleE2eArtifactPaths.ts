/**
 * Paths under samples/pendo-md that loctool may create during the pendo-md E2E localize run.
 * Shared by samples.e2e.test.ts (FSSnapshot) and globalTeardown.ts.
 */
import path from "path";

/** Root of the sample project passed to LoctoolRunner (absolute path). */
export const sampleProjectRoot = path.join(__dirname, "..", "samples", "pendo-md");

/** Files loctool may create that should not remain after tests (or should be snapshotted before E2E). */
export function getSampleE2eArtifactPaths(): string[] {
    return [
        path.join(sampleProjectRoot, "pendo-md-extracted.xliff"),
        path.join(sampleProjectRoot, "pendo-md-new.xliff"),
        path.join(
            sampleProjectRoot,
            "l10n",
            "xliff",
            "guides",
            "A000A00Aaa0aaa-AaaaAaa00A0a_pl-PL.xliff"
        ),
    ];
}

/*
 * FSSnapshot.ts - E2E test utility for filesystem snapshots
 *
 * Copyright © 2025, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "fs-extra";
import { join, basename } from "path";
import { tmpdir } from "os";

type Item = {
    path: string;
    backupPath: string;
};

type Nothing = {
    path: string;
    backupPath: null;
};

type SnapshotItem = Item | Nothing;

export class FSSnapshot {
    private readonly backupRoot: string = FSSnapshot.createBackupRoot();
    private readonly items: SnapshotItem[] = [];

    private static createBackupRoot(): string {
        return fs.mkdtempSync(join(tmpdir(), "ilib-fs-snapshot-root-"));
    }

    /**
     * Create a new snapshot of provided paths.
     *
     * The paths can be files, directories or non-existent items.
     *
     * @param paths - The paths to snapshot
     * @returns A new snapshot instance
     */
    static create(paths: string[]): FSSnapshot {
        const snapshot = new FSSnapshot();
        for (const path of paths) {
            snapshot.add(path);
        }
        return snapshot;
    }

    private add(path: string) {
        // if the item does not exist, add it to the items list as a nothing
        // so that we know to remove it later
        if (!fs.existsSync(path)) {
            this.items.push({
                path,
                backupPath: null,
            });
            return;
        }

        const stats = fs.statSync(path);
        if (!stats.isFile() && !stats.isDirectory()) {
            throw new Error(`Item [${path}] has unsupported type`);
        }

        // create a subdirectory within the backup root for this item to avoid collisions
        const itemDir = join(this.backupRoot, this.items.length.toString());
        fs.mkdirSync(itemDir);
        // copy the item to new subdirectory
        const backupPath = join(itemDir, basename(path));
        fs.copySync(path, backupPath);
        // track the item
        this.items.push({
            path,
            backupPath,
        });
    }

    /**
     * Restore original state of every snapshotted item.
     *
     * If the item was a file, it will be restored to its original content.
     * If the item was a directory, it will be recursively restored to its original contents
     * (i.e. extra files will be removed, missing files will be readded, changed files will be reverted).
     * If the item was non-existent at the moment of snapshotting, it will be removed.
     */
    public restore() {
        for (const item of this.items) {
            fs.removeSync(item.path);
            if (item.backupPath) {
                fs.copySync(item.backupPath, item.path, { overwrite: true });
            }
        }
    }
}

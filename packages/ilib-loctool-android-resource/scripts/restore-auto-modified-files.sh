#!/bin/bash

# restore-auto-modified-files.sh
# Restores files from backup (.original) files before running e2e tests

echo "🔄 Restoring auto-modified files from backup..."

# List of files that get automatically modified by e2e tests
AUTO_MODIFIED_FILES=(
    "samples/android/res/layout/t1.xml"
    # Add more files here as needed
)

# Restore files from backup
for file in "${AUTO_MODIFIED_FILES[@]}"; do
    backup_file="${file}.original"
    if [ -f "$backup_file" ]; then
        cp "$backup_file" "$file"
        echo "✅ Restored $file from $backup_file"
    else
        echo "⚠️  Backup file $backup_file not found"
    fi
done

echo "🎉 All auto-modified files restored from backup!"

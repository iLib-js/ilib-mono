#!/bin/bash

# restore-auto-modified-files.sh
# Restores files that are set to skip-worktree to their committed state
# Also cleans up files created by loctool

echo "🔄 Restoring auto-modified files to committed state..."

# List of files that get automatically modified by e2e tests
AUTO_MODIFIED_FILES=(
    "samples/android/res/layout/t1.xml"
    # Add more files here as needed
)

# Restore skip-worktree files
for file in "${AUTO_MODIFIED_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Temporarily disable skip-worktree
        git update-index --no-skip-worktree "$file" 2>/dev/null
        
        # Restore file to committed state
        git checkout HEAD -- "$file" 2>/dev/null
        
        # Re-enable skip-worktree
        git update-index --skip-worktree "$file" 2>/dev/null
        
        echo "✅ Restored $file"
    else
        echo "⚠️  File $file not found"
    fi
done

echo "🎉 All auto-modified files restored to committed state!"

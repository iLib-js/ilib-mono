#!/bin/bash

# setup-git-skip-worktree.sh
# Run this script after cloning the repository to set up skip-worktree for auto-modified files

echo "🔧 Setting up git skip-worktree for auto-modified files..."

# List of files that get automatically modified by e2e tests
AUTO_MODIFIED_FILES=(
    "packages/ilib-loctool-android-layout/samples/android/res/layout/t1.xml"
    # Add more files here as needed
)

for file in "${AUTO_MODIFIED_FILES[@]}"; do
    if [ -f "$file" ] && git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        git update-index --skip-worktree "$file"
        echo "✅ Set skip-worktree for $file"
    else
        echo "⚠️  File $file not found or not tracked"
    fi
done

echo "🎉 Setup complete! Auto-modified files will be ignored by git."
echo ""
echo "To restore auto-modified files to committed state:"
echo "  pnpm run clean:test:restore"
echo ""
echo "To temporarily stop ignoring changes (for commits):"
echo "  git update-index --no-skip-worktree <file>"
echo ""
echo "To re-ignore changes after committing:"
echo "  git update-index --skip-worktree <file>"

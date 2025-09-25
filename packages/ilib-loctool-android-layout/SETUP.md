# Git Skip-Worktree Setup

This package contains files that get automatically modified by e2e tests. To prevent accidentally committing these changes, run:

```bash
# Set up skip-worktree for auto-modified files
pnpm run setup

# Or run the root setup script
./setup-git-skip-worktree.sh
```

## Files with Skip-Worktree:
- `samples/android/res/layout/t1.xml` - Gets modified by e2e tests

## Managing Skip-Worktree:

### To commit changes to an auto-modified file:
```bash
# Temporarily stop ignoring changes
pnpm run setup:reset

# Make your changes and commit
git add samples/android/res/layout/t1.xml
git commit -m "Update t1.xml"

# Re-enable skip-worktree
pnpm run setup
```

### To check which files are being skipped:
```bash
git ls-files -v | grep "^S"
```

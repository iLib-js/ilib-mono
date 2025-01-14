#!/bin/bash
set -euo pipefail

### This script is used to compare the contents of the locally built package tarballs with the ones published on npm
### to ensure that no build step is missing. Note that it excludes the `docs` directory from the comparison (since we don't want to include the generated docs in the package tarballs).
### Usage: scripts/compare-package-contents.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MONOREPO_ROOT="$SCRIPT_DIR/.."
cd "$MONOREPO_ROOT"

# warn if any ignored files or folders are present (excluding node_modules)
if git status --porcelain --ignored -- packages/{} | grep -qv "node_modules/$"; then
    echo "There are uncommitted or ignored files present."
    echo "It's recommended to reset and clean everything (git reset --hard && git clean -fdx) before running this script"
    echo "Otherwise, leftovers from previous builds might be included in local package tarballs"
    echo "This can cause false inclusion of files that are not generated anymore (e.g. if you accidentally remove of the build steps)"
    echo "Press Enter to continue or Ctrl+C to cancel"
    read -r
fi

# Build packages and pack them into a tarball in the `compare-packs/local` directory
PACKS_LOCAL=compare-packs/local
rm -rf "$PACKS_LOCAL"
mkdir -p "$PACKS_LOCAL"
pnpm turbo run build --affected
pnpm -F '[main]' exec pnpm pack --pack-destination ../../"$PACKS_LOCAL"

# Download each corresponding package from npm as a tarball into the `compare-packs/npm` directory
PACKS_NPM=compare-packs/npm
PACKS_DIFFS=compare-packs/diffs
mkdir -p "$PACKS_NPM" "$PACKS_DIFFS"
for file in "$PACKS_LOCAL"/*.tgz; do
    tar_name="$(basename "$file" .tgz)"
    package_name="${tar_name%-*}" # strip version from tar file name
    package_version="${tar_name##*-}" # strip package name from tar file name
    package_version_major="${package_version%%.*}" # strip minor and patch version from package version
    
    # Download the corresponding package from npm as tarball
    # Ensure matching major version
    if compgen -G "$PACKS_NPM/$package_name-[0-9]*"; then
        echo "Package $package_name already downloaded"
    else
        npm pack "$package_name@$package_version_major" --pack-destination "$PACKS_NPM" || continue
    fi

    echo "Comparing $package_name"
    
    # Get contents of current package's tarballs excluding the `docs` directory
    local_files=$(tar -tf "$PACKS_LOCAL"/"$package_name"-[0-9]* | sort | grep -v '^package/docs/')
    npm_files=$(tar -tf "$PACKS_NPM"/"$package_name"-[0-9]* | sort | grep -v '^package/docs/')

    diff_output=$(diff <(echo "$local_files") <(echo "$npm_files")) || echo "$diff_output" > "$PACKS_DIFFS/$package_name.diff"
done
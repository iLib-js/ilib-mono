#!/bin/bash
set -e

### This script is used to compare the contents of the locally built package tarballs with the ones published on npm
### to ensure that no build step is missing. Note that it excludes the `docs` directory from the comparison (since we don't want to include the generated docs in the package tarballs).
### Usage: scripts/compare-package-contents.sh

# Build each package and pack it into a tarball in the `packs/packs-local` directory
mkdir -p packs/packs-local
pnpm build
pnpm -r exec pnpm pack --pack-destination ../../packs/packs-local

# Download each package from npm as a tarball into the `packs/packs-npm` directory
# Ensure matching major version
mkdir -p packs/packs-npm
for file in packs/packs-local/*.tgz; do
    tar_name="$(basename "$file" .tgz)"
    package_name="${tar_name%-*}" # strip version from tar file name
    package_version="${tar_name##*-}" # strip package name from tar file name
    package_version_major="${package_version%%.*}" # strip minor and patch version from package version
    
    # Download the corresponding package from npm
    npm pack "$package_name@$package_version_major" --pack-destination packs/packs-npm

    echo "Comparing $package_name"
    
    # Get contents of current package's tarballs excluding the `docs` directory
    local_files=$(tar -tf packs/packs-local/"$package_name"-[0-9]* | sort | grep -v '^package/docs/')
    npm_files=$(tar -tf packs/packs-npm/"$package_name"-[0-9]* | sort | grep -v '^package/docs/')

    diff <(echo "$local_files") <(echo "$npm_files") || true
done
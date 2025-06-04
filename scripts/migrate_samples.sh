#!/bin/bash

# Given that ilib-loctool-samples is copied into the monorepo
# (as subtree under packages/ilib-loctool-samplesusing scripts/add_repo.sh ilib-loctool-samples)
# this script will take every sample project (packages/ilib-loctool-samples/<sampleName>) and based on dependencies/devDependencies
# specified in its package.json it will copy the sample into the corresponding package (ilib-loctool-<plugin>/samples/<sampleName>)

for pkg in packages/ilib-loctool-samples/*/package.json; do
    if [ -f "$pkg" ]; then
        pkgName=$(basename "$(dirname "$pkg")")
        deps=$(jq -r '(.dependencies // {}) + (.devDependencies // {}) | keys[] | select(startswith("ilib-loctool-"))' "$pkg" 2>/dev/null)
        for dep in $deps; do
            if [ -d "packages/$dep" ]; then
                echo "Sample $pkgName is using $dep"
                mkdir -p "packages/$dep/samples/$pkgName" && cp -r "$(dirname "$pkg")"/. "packages/$dep/samples/$pkgName/"
            fi
        done
    fi
done
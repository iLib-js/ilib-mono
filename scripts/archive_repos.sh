#!/bin/bash
set -euo pipefail

## Script to mark all iLib-js repositories which were added into the monorepo as archived.
## Usage: ./archive_repos.sh [ilib-common wadimw/ilib-loctool-pendo-md ...]
## Note: you need to have the GitHub CLI installed and authenticated

# allow overwriting default org for all packages
DEFAULT_ORG=${DEFAULT_ORG:-"iLib-js"}

# some packages that we already have were added with path packages/ilib-<package>
# but didn't have the ilib- prefix in the original repository name ilib-js/<package>;
# map them to the correct repository names (e.g. package ilib-xliff > repository ilib-js/xliff)
PKG_TO_REPO_MAP=(
    "ilib-xliff:xliff"
    "ilib-tmx:tmx"
)

# ensure that the GitHub CLI is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI is not installed. Please install it before running this script"
    exit 1
fi
if ! gh auth status -h github.com &> /dev/null; then
    echo "GitHub CLI is not authenticated. Please authenticate before running this script"
    exit 1
fi

# if no repositories are provided through arguments, use foldernames in packages/ directory
REPOS=("$@")
if [ ${#REPOS[@]} -eq 0 ]; then
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    # shellcheck disable=SC2207 # we want to split the output of ls
    REPOS=($(ls "$SCRIPT_DIR/../packages"))
fi

for REPO in "${REPOS[@]}"; do
    # parse `org/` prefix if provided
    ORG=$DEFAULT_ORG
    if [[ "$REPO" == *"/"* ]]; then
        ORG=$(echo "$REPO" | cut -d'/' -f1)
        REPO=$(echo "$REPO" | cut -d'/' -f2)
    fi
    
    # map package name to repository name if needed
    for mapping in "${PKG_TO_REPO_MAP[@]}"; do
        if [ "$REPO" == "${mapping%%:*}" ]; then
            REPO="${mapping#*:}"
            break
        fi
    done

    echo "Processing repository $ORG/$REPO"

    # check if the repository exists (some packages might've been created in monorepo directly)
    if ! gh repo view "$ORG/$REPO" &> /dev/null; then
        echo "Repository $ORG/$REPO does not exist"
        continue
    fi

    # check if already archived
    if gh repo view "$ORG/$REPO" --json archived -q ".archived" &> /dev/null; then
        echo "Repository $ORG/$REPO is already archived"
        continue
    fi

    # mark repository as archived (will wait for confirmation)
    gh repo archive "$ORG/$REPO"
    # add flag --yes to skip confirmation prompt: gh repo archive "$ORG/$REPO" --yes
done
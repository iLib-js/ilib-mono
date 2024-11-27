#!/bin/bash
set -eu pipefail

## Script to mark all iLib-js repositories which were added into the monorepo as archived.
## Usage: ./archive_repos.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MONOREPO_ROOT_DIR="$SCRIPT_DIR/.."
cd "$MONOREPO_ROOT_DIR"

# list of original repositories which did not have the ilib- prefix
REPO_NAMES_NO_PREFIX='xliff;tmx'

# for each existing package in packages directory
for PACKAGE in packages/*; do
    PACKAGE_NAME=$(basename "$PACKAGE")
    echo "Processing package $PACKAGE_NAME"

    # get repo name - optionally remove the ilib- prefix from it if it is in the list
    # so basically ilib-lint > ilib-lint, ilib-xliff > xliff, message-accumulator > message-accumulator
    REPO=$(echo "$REPO_NAMES_NO_PREFIX" | grep -o "${PACKAGE_NAME#'ilib-'}" || true)
    if [ -z "$REPO" ]; then
        REPO=$PACKAGE_NAME
    fi

    # mark repository as archived (will wait for confirmation)
    gh repo archive "iLib-js/$REPO"
    # add flag --yes to skip confirmation prompt: gh repo archive "iLib-js/$REPO" --yes
done
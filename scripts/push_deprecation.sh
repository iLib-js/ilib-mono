#!/bin/bash
set -eu pipefail

## Script to open a pull request in all iLib-js repositories which were added into the monorepo
## to add a deprecation notice to the README.md file.
## Usage: ./push_deprecation.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MONOREPO_ROOT_DIR="$SCRIPT_DIR/.."
cd "$MONOREPO_ROOT_DIR"

URL_TEMPLATE='git@github.com:iLib-js/<repo>.git'

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

    # construct git url
    URL="${URL_TEMPLATE//<repo>/$REPO}"
    echo "Git URL $URL"

    # check if the repository exists
    if ! git ls-remote --exit-code "$URL" &> /dev/null; then
        echo "Repository $REPO does not exist"
        continue
    fi

    # clone the repository
    REPO_DIR=$(mktemp -d)
    git clone "$URL" "$REPO_DIR" --depth 1
    pushd "$REPO_DIR"

    # verify that the README.md file exists
    if [ ! -f README.md ]; then
        echo "Repository $REPO does not have a README.md file"
        popd
        rm -rf "$REPO_DIR"
        continue
    fi

    # get current (default) branch name
    BASE_BRANCH=$(git branch --show-current)

    # create a new branch for deprecation notice PR
    HEAD_BRANCH="deprecation-notice"
    git checkout -b "$HEAD_BRANCH"

    # prepend the deprecation notice to the README.md file
    NOTICE="""
> :warning: **Deprecation Notice** :warning:
> This repository has been deprecated. Please use the corresponding package from the [iLib-js monorepo](https://github.com/iLib-js/ilib-mono) instead.
"""
    echo "$NOTICE" | cat - README.md > README.md.tmp
    mv README.md.tmp README.md

    # commit the changes
    git add README.md
    git commit -m "Add deprecation notice"

    # push the changes to the remote repository
    git push origin "$HEAD_BRANCH"

    # create a pull request
    gh pr create --base "$BASE_BRANCH" --head "$HEAD_BRANCH" \
        --title "Add deprecation notice" \
        --body "Added deprecatin notice to the repository readme with a link to ilib-mono." \
        --reviewer "ehoogerbeets,nmkedziora,wadimw"
    
    # cleanup
    popd
    rm -rf "$REPO_DIR"
done
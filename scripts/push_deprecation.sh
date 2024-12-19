#!/bin/bash
set -euo pipefail

## Script to open a pull request in repositories which were added into the monorepo
## to add a deprecation notice to the README.md file.
## Usage: scripts/push_deprecation.sh [ilib-common wadimw/ilib-loctool-pendo-md ...]
## Note: you need to have the GitHub CLI installed and authenticated

# allow overwriting default org for all packages
DEFAULT_ORG=${DEFAULT_ORG:-"iLib-js"}

# allow overwriting default reviewers
REVIEWERS=${REVIEWERS:-"ehoogerbeets,nmkedziora,wadimw"}

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

    # construct git SSH url
    URL="git@github.com:$ORG/$REPO.git"
    echo "Git URL $URL"

    # check if the repository exists
    if ! git ls-remote --exit-code "$URL" &> /dev/null; then
        echo "Repository $URL does not exist"
        continue
    fi

    # clone the repository to a temporary directory
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

    # check if the repository is already deprecated
    if grep -q "Deprecation Notice" README.md; then
        echo "Repository $REPO already has a deprecation notice"
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
        --body "Added deprecation notice to the repository readme with a link to ilib-mono." \
        --reviewer "$REVIEWERS"
    
    # cleanup
    popd
    rm -rf "$REPO_DIR"
done
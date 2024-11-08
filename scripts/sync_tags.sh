#!/bin/bash
set -eu pipefail

## Script to carry over tags from all iLib-js repositories which were added into the monorepo
## Usage: ./sync_tags.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MONOREPO_ROOT_DIR="$SCRIPT_DIR/.."
cd "$MONOREPO_ROOT_DIR"

URL_TEMPLATE='git@github.com:iLib-js/<repo>.git'

# list of original repositories which did not have the ilib- prefix
REPO_NAMES_NO_PREFIX='xliff;tmx'

FAILED_REPOS=""
FAILED_TAGS=""
MISMATCHED_TAGS=""

# for each existing package in packages directory
for PACKAGE in packages/*
do
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
        FAILED_REPOS="$FAILED_REPOS $REPO"
        continue
    fi

    # iterate over existing tags in the remote repository
    while read -r TAG_HASH TAG_REF; do
        # process only annotated tags (i.e. with the ^{} suffix)
        if [[ ! $TAG_REF =~ \^\{\}$ ]]; then
            continue
        fi

        # extract tag name
        OLD_TAG=$(basename "${TAG_REF%'^{}'}")

        # prefix tag name with the package name
        NEW_TAG="$REPO-$OLD_TAG"

        # check if the tag already exists in the monorepo
        if MONOREPO_HASH=$(git rev-parse -q --verify "refs/tags/$NEW_TAG^{}"); then
            # warn if it points to a different commit
            if [ "$MONOREPO_HASH" != "$TAG_HASH" ]; then
                echo "WARNING: Tag $NEW_TAG already exists in the monorepo and points to a different commit"
                echo "  Monorepo commit $MONOREPO_HASH"
                echo "  Remote commit $TAG_HASH"
                MISMATCHED_TAGS="$MISMATCHED_TAGS $NEW_TAG (monorepo $MONOREPO_HASH, remote $TAG_HASH)"
            else
                echo "Tag $NEW_TAG already exists in the monorepo"
            fi
            continue
        fi

        # create a tag in the monorepo
        echo "Creating anotated tag $NEW_TAG $TAG_HASH"
        if ! git tag -a "$NEW_TAG" -m "$NEW_TAG" "$TAG_HASH"; then
            echo "Failed to create tag $NEW_TAG"
            FAILED_TAGS="$FAILED_TAGS $NEW_TAG ($TAG_HASH)"
        fi
    done < <(git ls-remote --tags "$URL")
done

if [ -n "$FAILED_REPOS" ]; then
    echo "Failed to process repositories:$FAILED_REPOS"
fi

if [ -n "$FAILED_TAGS" ]; then
    echo "Failed to create tags:$FAILED_TAGS"
fi

if [ -n "$MISMATCHED_TAGS" ]; then
    echo "Mismatched tags:$MISMATCHED_TAGS"
fi
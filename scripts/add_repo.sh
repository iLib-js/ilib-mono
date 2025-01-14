#!/bin/bash
set -euo pipefail

## Script to add an existing iLib-js repository into the monorepo
## in a way that keeps the commit history.
## Usage: scripts/add-repo.sh ilib-common wadimw/ilib-loctool-pendo-md ...

# allow overwriting default org for all packages
DEFAULT_ORG=${DEFAULT_ORG:-"iLib-js"}

# exit if running on main branch
if [ "$(git branch --show-current)" == "main" ]; then
    echo "Do not run this script on the main branch of the monorepo"
    exit 1
fi

# exit if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncommitted changes. Commit or stash them before running this script"
    exit 1
fi

# for each repository name in arguments
for REPO in "$@"
do
    # optionally parse github org if provided as org/repo,
    # otherwise default to iLib-js
    ORG=$DEFAULT_ORG
    if [[ "$REPO" == *"/"* ]]; then
        ORG=$(echo "$REPO" | cut -d'/' -f1)
        REPO=$(echo "$REPO" | cut -d'/' -f2)
    fi

    echo "Adding package from repository $ORG/$REPO"

    SUBTREE_PREFIX="packages/$REPO"
    if [ -d "packages/$REPO" ]; then
        echo "Package $REPO already exists in the monorepo"
        continue
    fi

    # construct git SSH url
    URL="git@github.com:$ORG/$REPO.git"
    echo "Git URL $URL"

    # add remote to the monorepo
    REMOTE="$REPO"
    echo "Adding temp remote $REMOTE"
    git remote add "$REMOTE" "$URL"

    # discover default branch name
    BRANCH=$(git remote show "$REMOTE" | grep 'HEAD branch' | cut -d' ' -f5)
    echo "Discovered default branch $BRANCH"
    git fetch "$REMOTE" "$BRANCH"

    # add subtree for the remote in folder packages/repo
    
    echo "Adding $REMOTE/$BRANCH in subtree $SUBTREE_PREFIX"
    git subtree add --prefix "$SUBTREE_PREFIX" "$REMOTE/$BRANCH"

    # cleanup: remove remote
    echo "Removing temp remote $REMOTE"
    git remote remove "$REMOTE"
done

echo "All packages added"
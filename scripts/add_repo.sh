#!/bin/bash
set -euo pipefail

## Script to add an existing iLib-js repository into the monorepo
## in a way that keeps the commit history.
## Usage: ./add-repo.sh ilib-common ilib-lint-common ...

URL_TEMPLATE='git@github.com:iLib-js/<repo>.git'
SUBTREE_PREFIX_TEMPLATE='packages/<repo>'

# exit if running on main branch
if [ "$(git branch --show-current)" == "main" ]; then
    echo "Do not run this script on the main branch"
    exit 1
fi

# for each repository name in arguments
for REPO in "$@"
do
    echo "Adding repository $REPO"

    # construct git url
    URL="${URL_TEMPLATE//<repo>/$REPO}"
    echo "Git URL $URL"

    # discover default branch name
    BRANCH=$(git ls-remote --heads "$URL" | grep -oP 'refs/heads/\K.*' | head -n 1)
    echo "Discovered default branch $BRANCH"

    # add remote to the monorepo
    REMOTE="$REPO"
    echo "Adding remote $REMOTE"
    git remote add "$REMOTE" "$URL"
    git fetch "$REMOTE" "$BRANCH"

    # add subtree for the remote
    PREFIX="${SUBTREE_PREFIX_TEMPLATE//<repo>/$REPO}"
    echo "Adding subtree $PREFIX"
    git subtree add --prefix "$PREFIX" "$REMOTE/$BRANCH"

    # cleanup: remove remote
    git remote remove "$REMOTE"
done

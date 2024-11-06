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

# exit if there are uncommitted changes
#if [ -n "$(git status --porcelain)" ]; then
#    echo "There are uncommitted changes. Commit or stash them before running this script"
#    exit 1
#fi

# for each repository name in arguments
for REPO in "$@"
do
    echo "Adding repository $REPO"

    # construct git url
    URL="${URL_TEMPLATE//<repo>/$REPO}"
    echo "Git URL $URL"

    # add remote to the monorepo
    REMOTE="$REPO"
    echo "Adding remote $REMOTE"
    git remote add "$REMOTE" "$URL"

    # discover default branch name
    BRANCH=$(git remote show "$REMOTE" | grep 'HEAD branch' | cut -d' ' -f5)
    #echo "Discovered default branch $BRANCH"
    #git fetch "$REMOTE" "$BRANCH"

    # add subtree for the remote
    #PREFIX="${SUBTREE_PREFIX_TEMPLATE//<repo>/$REPO}"
    #echo "Adding subtree $PREFIX"
    #git subtree add --prefix "$PREFIX" "$REMOTE/$BRANCH"

    # carry over tags to the new repository
    git ls-remote --tags $REMOTE | grep '{}' | sed 's|refs/tags/||' | sed 's|\^{}||' > tags.txt
    for tag in $(awk '{print $2}' tags.txt); do
        COMMIT=$(grep $tag tags.txt | awk '{print $1}')
        echo "Creating tag $REMOTE-$tag" on commit $COMMIT
        # Create a new tag in the monorepo using the original tag's commit
        git tag -a "$REMOTE-$tag" -m "$REMOTE-$tag" "$COMMIT"
        git push origin "$REMOTE-$tag"
    done

    # cleanup: remove remote
    git remote remove "$REMOTE"
done

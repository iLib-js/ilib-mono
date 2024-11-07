#!/bin/bash
set -euo pipefail

## Script to add an existing iLib-js repository into the monorepo
## in a way that keeps the commit history.
## Usage: ./add-repo.sh ilib-common ilib-lint-common ...

URL_TEMPLATE='git@github.com:iLib-js/<repo>.git'
SUBTREE_PREFIX_TEMPLATE='packages/<repo>'

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
    echo "Discovered default branch $BRANCH"

    # carry over tags to the new repository
    git ls-remote --tags $REMOTE | grep '{}' | sed 's|refs/tags/||' | sed 's|\^{}||' > tags.txt
    for tag in $(awk '{print $2}' tags.txt); do
        COMMIT=$(grep $tag tags.txt | awk '{print $1}')
        echo "Creating tag $REMOTE-$tag" on commit $COMMIT
        # Create a new tag in the monorepo using the original tag's commit
        git tag -a "$REMOTE-$tag" -m "$REMOTE-$tag" "$COMMIT"
    done
    git push origin --tags

    # cleanup: remove remote
    git remote remove "$REMOTE"
done

#!/bin/zsh
set -e

# mkdir -p packs-local && pnpm -r exec pnpm pack --pack-destination ../../packs/packs-local

# mkdir -p packs-npm && for file in packs-local/*.tgz; do pname="$(basename "$file" .tgz)"; npm pack "${pname%-*}@${${pname##*-}%%.*}" --prefix packs-npm; done

for f in packs-local/*.tgz; do
    local pname="${$(basename "$f" .tgz)%-*}"
    echo "Comparing $pname"
    local local_files=$(tar -tf packs-local/$pname-[0-9]*)
    local npm_files=$(tar -tf packs-npm/$pname-[0-9]*)
    diff <(echo "$local_files" | sort | grep -v '^package/docs/') <(echo "$npm_files" | sort | grep -v '^package/docs/') || true
done
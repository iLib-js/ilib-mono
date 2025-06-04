#!/bin/bash

# For every sample project in packages/*/samples/*
# overwrite its package.json with the following template:
# {
#     "private": true,
#     "description": existing description or "Sample localization project",
#     "devDependencies": {
#         [dependencies or devDependencies]: "workspace:^"
#     }
#

for sample in packages/*/samples/*; do
    if [ ! -f "$sample/package.json" ]; then
        echo "Skipping $sample - no package.json found"
        continue
    fi

    # extract values from the existing package.json
    description=$(jq -r '.description // "Sample localization project"' "$sample/package.json")
    allDeps=$(jq -r '(.dependencies // {}) + (.devDependencies // {})' "$sample/package.json")

    # map allDeps to workspace:^
    allDeps=$(echo "$allDeps" | jq -r 'to_entries | map(.value = "workspace:^") | from_entries')

    # assemble the new package.json
    jq -n \
        --arg description "$description" \
        --argjson allDeps "$allDeps" \
        '
        {
            "private": true,
            "description": $description,
            "devDependencies": $allDeps
        }
        ' \
        > "$sample/package.json"
done
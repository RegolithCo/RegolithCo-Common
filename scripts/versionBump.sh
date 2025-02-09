#!/bin/bash


# USAGE: ./scripts/versionBump.sh <version-bump-type>
# Running this script will make a commit with the new version and tag it with the new version.
# This will trigger the GitHub Actions workflow to publish the package to npm.

# Ensure the script exits if any command fails
set -e

# Check if a version bump type is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version-bump-type>"
  echo "Version bump types: patch, minor, major"
  exit 1
fi

# Bump the version in package.json
npm version $1 -m "Bump version to %s"

# Get the new version from package.json
NEW_VERSION=$(jq -r .version < package.json)

# Tag the commit with the new version
git tag "@regolithco/common@$NEW_VERSION"

# Push the commit and the tag to the remote repository
git push origin main --tags

echo "Version bumped to $NEW_VERSION and tagged as @regolithco/common@$NEW_VERSION"